package com.foodflow.service.impl;

import com.foodflow.exception.InvalidOrderException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.*;
import com.foodflow.repository.*;
import com.foodflow.service.DropOrderService;
import com.foodflow.service.NotificationService;
import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.dto.response.OrderResponse;
import com.foodflow.websocket.DropWebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DropOrderServiceImpl implements DropOrderService {

    private final FoodDropRepository dropRepository;
    private final DropItemRepository dropItemRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;
    private final RestaurantRepository restaurantRepository;
    private final DropWebSocketService webSocketService;

    @Override
    @Transactional
    public OrderResponse placeDropOrder(Long userId, PlaceDropOrderRequest request) {
        
        FoodDrop drop = dropRepository.findById(request.getDropId())
            .orElseThrow(() -> new ResourceNotFoundException("Drop not found"));
        
        if (!drop.isAcceptingOrders()) {
            if (drop.isSoldOut()) {
                throw new InvalidOrderException("This drop is sold out");
            }
            if (LocalDateTime.now().isAfter(drop.getOrderCutoffTime())) {
                throw new InvalidOrderException("Order cutoff has passed for this drop");
            }
            throw new InvalidOrderException("This drop is not currently accepting orders");
        }
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (PlaceDropOrderRequest.ItemRequest itemRequest : request.getItems()) {
            DropItem dropItem = dropItemRepository
                .findByDropAndItemWithLock(drop.getDropId(), itemRequest.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Item not available in this drop"));
            
            if (dropItem.isSoldOut()) {
                throw new InvalidOrderException(
                    dropItem.getMenuItem().getName() + " is sold out in this drop");
            }
            
            int available = dropItem.getQuantityAvailable() - dropItem.getQuantityOrdered();
            if (itemRequest.getQuantity() > available) {
                throw new InvalidOrderException(
                    "Only " + available + " portions of " + 
                    dropItem.getMenuItem().getName() + " remaining");
            }
            
            dropItem.setQuantityOrdered(dropItem.getQuantityOrdered() + itemRequest.getQuantity());
            dropItemRepository.save(dropItem);
            
            BigDecimal itemPrice = dropItem.getEffectivePrice();
            BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
            
            OrderItem orderItem = OrderItem.builder()
                .menuItem(dropItem.getMenuItem())
                .quantity(itemRequest.getQuantity())
                .priceEach(itemPrice)
                .build();
            orderItems.add(orderItem);
        }
        
        drop.setCurrentOrders(drop.getCurrentOrders() + 1);
        dropRepository.save(drop);
        
        if (request.isDelivery() && drop.getIsDeliveryAvailable()) {
            totalAmount = totalAmount.add(drop.getDeliveryCharge());
        }
        
        Order order = Order.builder()
            .user(userRepository.getReferenceById(userId))
            .restaurant(drop.getCreator())
            .drop(drop)
            .orderType(Order.OrderType.DROP_PREORDER)
            .status(OrderStatus.PLACED)
            .totalAmount(totalAmount)
            .pickupTime(request.getPickupTime())
            .specialInstructions(request.getSpecialInstructions())
            .isDelivery(request.isDelivery())
            .deliveryAddress(request.getDeliveryAddress())
            .build();
        
        Order savedOrder = orderRepository.save(order);
        
        orderItems.forEach(item -> item.setOrder(savedOrder));
        orderItemRepository.saveAll(orderItems);
        
        Payment payment = Payment.builder()
            .order(savedOrder)
            .method(PaymentMethod.valueOf(request.getPaymentMethod())) // modified to enum mapping
            .amount(totalAmount)
            .status(PaymentStatus.PENDING) // modified to enum mapping
            .build();
        paymentRepository.save(payment);
        
        notificationService.sendNotification(
            userId,
            Notification.NotificationType.ORDER_CONFIRMED,
            "Order Confirmed!",
            "Your pre-order for " + drop.getTitle() + " is confirmed. " +
            "Collection: " + drop.getPickupStartTime(),
            Notification.ReferenceType.ORDER,
            savedOrder.getOrderId()
        );
        
        restaurantRepository.incrementTotalOrders(drop.getCreator().getRestaurantId());
        
        webSocketService.broadcastDropUpdate(
            drop.getDropId(),
            drop.getCurrentOrders(),
            drop.getMaxOrders()
        );
        
        List<com.foodflow.dto.response.OrderItemResponse> itemResponses = orderItems.stream()
            .map(item -> com.foodflow.dto.response.OrderItemResponse.builder()
                .orderItemId(item.getOrderItemId())
                .menuItemId(item.getMenuItem().getItemId())
                .itemName(item.getMenuItem().getName())
                .quantity(item.getQuantity())
                .priceEach(item.getPriceEach())
                .build())
            .collect(java.util.stream.Collectors.toList());
            
        return OrderResponse.builder()
            .orderId(savedOrder.getOrderId())
            .userId(savedOrder.getUser().getUserId())
            .restaurantId(savedOrder.getRestaurant().getRestaurantId())
            .restaurantName(savedOrder.getRestaurant().getName())
            .status(savedOrder.getStatus())
            .totalAmount(savedOrder.getTotalAmount())
            .orderDate(savedOrder.getOrderDate())
            .items(itemResponses)
            .paymentStatus(payment.getStatus())
            .build();
    }

    @Override
    @Transactional
    public void cancelDropOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
            
        if (!order.getUser().getUserId().equals(userId)) {
            throw new InvalidOrderException("You can only cancel your own orders");
        }
        
        if (order.getStatus() != OrderStatus.PLACED) {
            throw new InvalidOrderException("Order cannot be cancelled in its current state");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        // Decrement drop order count
        FoodDrop drop = order.getDrop();
        if (drop != null) {
            drop.setCurrentOrders(Math.max(0, drop.getCurrentOrders() - 1));
            dropRepository.save(drop);
            
            // Restore item quantities
            List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
            for (OrderItem item : items) {
                dropItemRepository.findByDropAndItemWithLock(drop.getDropId(), item.getMenuItem().getItemId())
                    .ifPresent(dropItem -> {
                        dropItem.setQuantityOrdered(Math.max(0, dropItem.getQuantityOrdered() - item.getQuantity()));
                        dropItemRepository.save(dropItem);
                    });
            }
        }
    }
}

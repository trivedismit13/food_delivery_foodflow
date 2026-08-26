package com.foodflow.service.impl;

import com.foodflow.exception.InvalidOrderException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.*;
import com.foodflow.repository.*;
import com.foodflow.service.DropOrderService;
import com.foodflow.service.NotificationService;
import com.foodflow.service.PaymentService;
import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.dto.response.OrderResponse;

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
    private final PaymentService paymentService;
    private final RestaurantRepository restaurantRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public OrderResponse placeDropOrder(Long userId, PlaceDropOrderRequest request) {
        
        FoodDrop drop = dropRepository.findByIdWithLock(request.getDropId())
            .orElseThrow(() -> new ResourceNotFoundException("Drop not found"));
        
        if (LocalDateTime.now().isAfter(drop.getOrderCutoffTime())) {
            throw new InvalidOrderException(
                "Order window has closed for this drop. " +
                "Cutoff was " + drop.getOrderCutoffTime().toString()
            );
        }
        
        if (drop.getStatus() != FoodDrop.DropStatus.OPEN) {
            throw new InvalidOrderException(
                "This drop is not currently accepting orders. Status: " + drop.getStatus()
            );
        }
        
        if (drop.getCurrentOrders() >= drop.getMaxOrders()) {
            throw new InvalidOrderException("This drop is sold out");
        }
        
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        List<PlaceDropOrderRequest.ItemRequest> sortedItems = new ArrayList<>(request.getItems());
        sortedItems.sort(java.util.Comparator.comparing(PlaceDropOrderRequest.ItemRequest::getItemId));
        
        for (PlaceDropOrderRequest.ItemRequest itemRequest : sortedItems) {
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
            
            int remaining = dropItem.getQuantityAvailable() - dropItem.getQuantityOrdered();
            if (remaining <= 5 && (remaining + itemRequest.getQuantity()) > 5) {
                eventPublisher.publishEvent(new com.foodflow.event.LowStockEvent(
                    this,
                    drop.getCreator().getOwner().getUserId(),
                    drop.getDropId(),
                    drop.getTitle(),
                    dropItem.getMenuItem().getName(),
                    remaining
                ));
            }
            
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
        
        Order order = Order.builder()
            .user(userRepository.getReferenceById(userId))
            .restaurant(drop.getCreator())
            .drop(drop)
            .orderType(Order.OrderType.DROP_PREORDER)
            .status(OrderStatus.PLACED)
            .totalAmount(totalAmount)
            .pickupTime(drop.getPickupTime())
            .specialInstructions(request.getSpecialInstructions())
            .build();
        
        Order savedOrder = orderRepository.save(order);
        
        orderItems.forEach(item -> item.setOrder(savedOrder));
        orderItemRepository.saveAll(orderItems);
        
        Payment payment = Payment.builder()
            .order(savedOrder)
            .method(PaymentMethod.CASH)
            .amount(totalAmount)
            .status(PaymentStatus.PENDING)
            .build();
        paymentService.processPayment(payment);
        
        restaurantRepository.incrementTotalOrders(drop.getCreator().getRestaurantId());
        
        eventPublisher.publishEvent(new com.foodflow.event.DropOrderConfirmedEvent(
            this,
            userId,
            savedOrder.getOrderId(),
            drop.getTitle(),
            drop.getPickupStartTime() != null ? drop.getPickupStartTime().toString() : "N/A",
            drop.getDropId(),
            drop.getCurrentOrders(),
            drop.getMaxOrders()
        ));
        
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
            .dropId(savedOrder.getDrop() != null ? savedOrder.getDrop().getDropId() : null)
            .pickupInfo(savedOrder.getPickupTime())
            .specialInstructions(savedOrder.getSpecialInstructions())
            .build();
    }

    @Override
    @Transactional
    public void cancelDropOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
            
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new com.foodflow.exception.ResourceNotFoundException("User not found"));
            
        boolean isOwner = order.getUser().getUserId().equals(currentUser.getUserId());
        boolean isCreator = false;
        FoodDrop drop = order.getDrop();
        if (drop != null && drop.getCreator() != null && drop.getCreator().getOwner() != null) {
            isCreator = drop.getCreator().getOwner().getUserId().equals(currentUser.getUserId());
        }
        
        if (!isOwner && !isCreator) {
            throw new InvalidOrderException("You do not have permission to cancel this order");
        }
        
        if (order.getStatus() != OrderStatus.PLACED) {
            throw new InvalidOrderException("Order cannot be cancelled in its current state");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        // Decrement drop order count
        if (drop != null) {
            drop.setCurrentOrders(Math.max(0, drop.getCurrentOrders() - 1));
            dropRepository.save(drop);
            
            // Restore item quantities
            List<OrderItem> items = orderItemRepository.findByOrderOrderId(orderId);
            for (OrderItem item : items) {
                dropItemRepository.findByDropAndItemWithLock(drop.getDropId(), item.getMenuItem().getItemId())
                    .ifPresent(dropItem -> {
                        dropItem.setQuantityOrdered(Math.max(0, dropItem.getQuantityOrdered() - item.getQuantity()));
                        dropItem.setQuantityAvailable(dropItem.getQuantityAvailable() + item.getQuantity());
                        dropItemRepository.save(dropItem);
                    });
            }
        }
        
        paymentService.getPaymentByOrderId(orderId).ifPresent(payment -> {
            paymentService.updatePaymentStatus(payment.getPaymentId(), PaymentStatus.CANCELLED);
        });
        
        eventPublisher.publishEvent(new com.foodflow.event.DropOrderCancelledEvent(this, orderId));
    }
}

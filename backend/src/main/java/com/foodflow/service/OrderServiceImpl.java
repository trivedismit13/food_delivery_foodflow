package com.foodflow.service;

import com.foodflow.dto.request.OrderItemRequest;
import com.foodflow.dto.response.OrderItemResponse;
import com.foodflow.dto.response.OrderResponse;
import com.foodflow.exception.InsufficientInventoryException;
import com.foodflow.exception.InvalidOrderException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.*;
import com.foodflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final PaymentService paymentService;

    @Override
    @Transactional
    public OrderResponse placeOrder(Long userId, Long restaurantId, List<OrderItemRequest> items, PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getIsOpen()) {
            throw new InvalidOrderException("Restaurant is currently closed");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        // 1. Create the Order entity (we need it to associate items)
        Order order = Order.builder()
                .user(user)
                .restaurant(restaurant)
                .status(OrderStatus.PLACED)
                .totalAmount(BigDecimal.ZERO) // Will update after calculating items
                .build();
        
        // Save order to get ID for items
        order = orderRepository.save(order);

        for (OrderItemRequest itemRequest : items) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + itemRequest.getItemId()));

            // Validate item belongs to the requested restaurant
            if (!menuItem.getRestaurant().getRestaurantId().equals(restaurantId)) {
                throw new InvalidOrderException("Item " + menuItem.getName() + " does not belong to restaurant " + restaurantId);
            }

            // Check inventory
            if (menuItem.getAvailableQty() < itemRequest.getQuantity()) {
                throw new InsufficientInventoryException("Not enough inventory for item: " + menuItem.getName());
            }

            // Decrement inventory
            menuItem.setAvailableQty(menuItem.getAvailableQty() - itemRequest.getQuantity());
            menuItemRepository.save(menuItem);

            // Calculate amount
            BigDecimal itemTotal = menuItem.getPrice().multiply(new BigDecimal(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            // Create OrderItem (snapshot price)
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemRequest.getQuantity())
                    .priceEach(menuItem.getPrice())
                    .build();
            orderItemRepository.save(orderItem);
        }

        // Update order total amount
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Create Payment in PENDING state
        Payment payment = Payment.builder()
                .order(order)
                .amount(totalAmount)
                .method(paymentMethod != null ? paymentMethod : PaymentMethod.CARD)
                .status(PaymentStatus.PENDING)
                .build();
        paymentService.processPayment(payment);

        return mapToResponse(order);
    }

    @Override
    public OrderResponse getOrderById(Long orderId, Long userId, String role) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
                
        boolean isOwner = order.getUser().getUserId().equals(userId);
        boolean isRestaurantOwner = order.getRestaurant().getOwner().getUserId().equals(userId);
        boolean isAdmin = "ADMIN".equals(role);
        
        if (!isOwner && !isRestaurantOwner && !isAdmin) {
            throw new com.foodflow.exception.InvalidRequestException("Cannot view another user's order");
        }
                
        return mapToResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Override
    public Page<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserUserId(userId, pageable).map(this::mapToResponse);
    }

    @Override
    public Page<OrderResponse> getRestaurantOrders(Long restaurantId, Pageable pageable) {
        return orderRepository.findByRestaurantRestaurantId(restaurantId, pageable).map(this::mapToResponse);
    }

    @Override
    public java.util.List<OrderResponse> getDropOrders(Long dropId) {
        return orderRepository.findByDropDropId(dropId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderOrderId(order.getOrderId());
        Payment payment = paymentService.getPaymentByOrderId(order.getOrderId()).orElse(null);

        List<OrderItemResponse> itemResponses = orderItems.stream().map(item -> OrderItemResponse.builder()
                .orderItemId(item.getOrderItemId())
                .menuItemId(item.getMenuItem().getItemId())
                .itemName(item.getMenuItem().getName())
                .quantity(item.getQuantity())
                .priceEach(item.getPriceEach())
                .build()).collect(Collectors.toList());

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .restaurantId(order.getRestaurant().getRestaurantId())
                .restaurantName(order.getRestaurant().getName())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .orderDate(order.getOrderDate())
                .items(itemResponses)
                .paymentStatus(payment != null ? payment.getStatus() : null)
                .dropId(order.getDrop() != null ? order.getDrop().getDropId() : null)
                .isDelivery(order.getIsDelivery())
                .deliveryAddress(order.getDeliveryAddress())
                .pickupTime(order.getPickupTime())
                .specialInstructions(order.getSpecialInstructions())
                .build();
    }
}

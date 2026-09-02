package com.foodflow.service;

import com.foodflow.dto.response.OrderResponse;
import com.foodflow.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse placeOrder(Long userId, Long restaurantId, java.util.List<com.foodflow.dto.request.OrderItemRequest> items);
    OrderResponse getOrderById(Long orderId, Long userId, String role);
    OrderResponse updateOrderStatus(Long orderId, com.foodflow.model.OrderStatus status);
    Page<OrderResponse> getUserOrders(Long userId, Pageable pageable);
    Page<OrderResponse> getRestaurantOrders(Long restaurantId, Pageable pageable);
    java.util.List<OrderResponse> getDropOrders(Long dropId);
}

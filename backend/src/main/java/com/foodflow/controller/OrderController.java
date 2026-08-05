package com.foodflow.controller;

import com.foodflow.dto.request.PlaceOrderRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.OrderResponse;
import com.foodflow.model.OrderStatus;
import com.foodflow.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        OrderResponse order = orderService.placeOrder(request.getUserId(), request.getRestaurantId(), request.getItems(), request.getPaymentMethod());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(order));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long id, 
            @AuthenticationPrincipal com.foodflow.security.UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
            orderService.getOrderById(id, userDetails.getId(), userDetails.getRole())
        ));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateOrderStatus(id, status)));
    }

    @GetMapping("/users/{userId}/orders")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getUserOrders(@PathVariable Long userId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getUserOrders(userId, pageable)));
    }

    @GetMapping("/restaurants/{restaurantId}/orders")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getRestaurantOrders(@PathVariable Long restaurantId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getRestaurantOrders(restaurantId, pageable)));
    }

    @GetMapping("/drops/{dropId}/orders")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<java.util.List<OrderResponse>>> getDropOrders(@PathVariable Long dropId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getDropOrders(dropId)));
    }
}

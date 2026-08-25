package com.foodflow.dto.response;

import com.foodflow.model.OrderStatus;
import com.foodflow.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private Long restaurantId;
    private String restaurantName;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime orderDate;
    private List<OrderItemResponse> items;
    private PaymentStatus paymentStatus;
    private Long dropId;
    private Boolean isDelivery;
    private String deliveryAddress;
    private LocalDateTime pickupTime;
    private String specialInstructions;
}

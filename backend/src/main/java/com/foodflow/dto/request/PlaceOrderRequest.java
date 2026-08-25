package com.foodflow.dto.request;

import com.foodflow.model.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlaceOrderRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotEmpty(message = "Order must contain at least one item")
    @jakarta.validation.Valid
    private List<OrderItemRequest> items;

    // Default to CARD if not provided
    private PaymentMethod paymentMethod = PaymentMethod.CARD;
}

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
    private Long userId;

    private Long restaurantId;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;

    // Default to CARD if not provided
    private PaymentMethod paymentMethod = PaymentMethod.CARD;
}

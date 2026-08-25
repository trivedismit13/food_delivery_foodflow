package com.foodflow.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlaceDropOrderRequest {

    private Long dropId;

    @NotEmpty(message = "At least one item is required")
    @jakarta.validation.Valid
    private List<ItemRequest> items;

    @NotNull(message = "Payment method is required")
    private String paymentMethod;

    @Future(message = "Pickup time must be in the future")
    private LocalDateTime pickupTime;

    private String specialInstructions;

    @JsonProperty("isDelivery")
    private boolean isDelivery;

    private String deliveryAddress;

    @Data
    public static class ItemRequest {
        @NotNull(message = "Item ID is required")
        private Long itemId;

        @NotNull(message = "Quantity is required")
        @jakarta.validation.constraints.Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }
}

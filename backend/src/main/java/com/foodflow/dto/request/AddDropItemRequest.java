package com.foodflow.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddDropItemRequest {

    @NotNull(message = "Item ID is required")
    private Long itemId;

    @NotNull(message = "Quantity available is required")
    private Integer quantityAvailable;

    private BigDecimal dropPrice;
}

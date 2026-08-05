package com.foodflow.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DropItemResponse {
    private Long itemId;
    private String name;
    private String description;
    private Boolean isVeg;
    private BigDecimal price; // Original menu price
    private BigDecimal dropPrice; // The effective price for this drop
    private Integer quantityAvailable;
    private Integer quantityOrdered;
    private Boolean isSoldOut;
}

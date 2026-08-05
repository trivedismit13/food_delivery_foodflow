package com.foodflow.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DropItemRequest {

    private Long itemId;

    // Optional if maxQuantityPerOrder is provided
    private Integer quantityAvailable;

    private BigDecimal dropPrice;

    // For creating new items on the fly (from frontend CreateDropPage)
    private String name;
    private String description;
    private BigDecimal price;
    private Boolean isVegetarian;
    private Integer maxQuantityPerOrder;
}

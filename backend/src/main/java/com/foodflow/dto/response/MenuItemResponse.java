package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponse {
    private Long menuItemId;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Boolean isAvailable;
    private Boolean isVegetarian;
    private Boolean isVegan;
    private Boolean isGlutenFree;
    private String category;
}

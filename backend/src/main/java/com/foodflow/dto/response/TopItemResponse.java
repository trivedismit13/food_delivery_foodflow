package com.foodflow.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TopItemResponse {
    private String itemName;
    private Integer totalOrders;
    private BigDecimal totalRevenue;
}

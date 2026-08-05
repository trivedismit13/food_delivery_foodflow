package com.foodflow.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatorDashboardResponse {
    private Long creatorId;
    private String creatorName;
    private String period;
    
    private BigDecimal totalRevenue;
    private Integer totalOrders;
    private BigDecimal avgOrderValue;
    
    private BigDecimal revenueChange;
    private Integer ordersChange;
    
    private Double repeatCustomerRate;
    private Integer totalUniqueCustomers;
    private Integer followerCount;
    
    private Integer totalDrops;
    private Integer completedDrops;
    private Double avgDropFillRate;
    
    private String bestSellingItem;
    private String bestDropTitle;
    private String bestDayOfWeek;
}

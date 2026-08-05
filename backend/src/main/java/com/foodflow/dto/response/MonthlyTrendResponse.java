package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyTrendResponse {
    private Long restaurantId;
    private String metric; // e.g. "REVENUE", "ORDERS", "RATING"
    private Map<String, BigDecimal> monthlyData; // e.g. {"2024-01": 1500.0, "2024-02": 1800.0}
    private String trendSummary; // e.g. "Up 20% compared to last month"
}

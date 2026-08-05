package com.foodflow.ai;

import com.foodflow.dto.response.InsightResponse;

public interface InsightStrategy {
    InsightResponse generateInsight(Long restaurantId, String query);
    boolean supports(String queryType);
}

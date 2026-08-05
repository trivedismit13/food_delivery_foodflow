package com.foodflow.ai;

import com.foodflow.dto.response.InsightResponse;
import com.foodflow.dto.response.RatingBreakdownResponse;
import com.foodflow.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class RuleBasedInsightStrategy implements InsightStrategy {

    private final RatingService ratingService;

    @Override
    public InsightResponse generateInsight(Long restaurantId, String query) {
        RatingBreakdownResponse breakdown = ratingService.getRatingBreakdown(restaurantId);
        
        StringBuilder insightBuilder = new StringBuilder();
        
        if (breakdown.getBreakdown() != null) {
            BigDecimal food = breakdown.getBreakdown().getFoodQuality();
            BigDecimal delivery = breakdown.getBreakdown().getDeliveryExperience();
            
            if (food != null && delivery != null && food.compareTo(new BigDecimal("4.0")) > 0 && delivery.compareTo(new BigDecimal("3.0")) < 0) {
                insightBuilder.append("Your food quality is excellent, but delivery experience is dragging your overall rating down. Consider reviewing your delivery partners or packaging to keep food warm. ");
            }
        }
        
        if (insightBuilder.length() == 0) {
            insightBuilder.append("Your ratings are currently stable. No critical operational anomalies detected in the rule-based engine.");
        }

        return InsightResponse.builder()
                .question(query)
                .insight(insightBuilder.toString())
                .supportingData(breakdown)
                .confidence(0.9)
                .build();
    }

    @Override
    public boolean supports(String queryType) {
        return "AUTO".equalsIgnoreCase(queryType) || "RULES".equalsIgnoreCase(queryType);
    }
}

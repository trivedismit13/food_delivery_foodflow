package com.foodflow.service.impl;

import com.foodflow.dto.response.InsightResponse;
import com.foodflow.repository.AnalyticsRepository;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.service.LlmClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InsightService {

    private final AnalyticsRepository analyticsRepository;
    private final FoodDropRepository dropRepository;
    private final LlmClient llmClient;
    private final com.foodflow.service.security.CreatorAuthorizationService creatorAuthorizationService;

    public InsightResponse generateCreatorInsight(Long creatorId, String question) {
        
        creatorAuthorizationService.assertCreatorOwnsAnalytics(creatorId);

        // RETRIEVAL: fetch all relevant context from database
        Map<String, Object> context = new HashMap<>();
        
        context.put("creatorStats", analyticsRepository.findCreatorSummary(creatorId));
        context.put("weeklyTrend", analyticsRepository.findWeeklyRevenueTrend(creatorId, 8));
        context.put("topItems", analyticsRepository.findTopItemsForCreator(creatorId));
        context.put("dropPerformance", analyticsRepository.findFastestSellingDrops(creatorId));
        context.put("bestDay", analyticsRepository.findBestDayOfWeekForCreator(creatorId));
        context.put("repeatRate", analyticsRepository.findRepeatCustomerRate(creatorId));
        context.put("recentDrops", dropRepository.findRecentDrops(creatorId, 5));
        
        // AUGMENTATION: build grounded prompt
        String prompt = """
            You are an analytics assistant for a food creator platform.
            The creator is asking: "%s"
            
            Here is their actual data:
            - Weekly revenue for last 8 weeks: %s
            - Top selling items: %s  
            - Drop performance history: %s
            - Best day of week: %s
            - Repeat customer rate: %s
            - Recent drops: %s
            
            Answer ONLY based on the data provided above.
            If the data is empty or 'N/A', say that you do not have enough data to answer.
            Be specific — use actual numbers from the data.
            Keep the answer under 150 words.
            End with one concrete recommendation.
            """.formatted(
                question,
                formatList(context.get("weeklyTrend")),
                formatList(context.get("topItems")),
                formatList(context.get("dropPerformance")),
                formatObjectArray(context.get("bestDay")),
                formatObjectArray(context.get("repeatRate")),
                formatList(context.get("recentDrops"))
            );
        
        // GENERATION: call LLM
        String insight = llmClient.generate(prompt);
        
        return InsightResponse.builder()
            .question(question)
            .insight(insight)
            .supportingDataKeys(context.keySet())

            .generatedAt(LocalDateTime.now())
            .build();
    }

    public List<InsightResponse> generateAutoInsights(Long creatorId) {
        creatorAuthorizationService.assertCreatorOwnsAnalytics(creatorId);
        List<InsightResponse> insights = new ArrayList<>();
        
        // Rule 1: Repeat customer rate below 30%
        // Only generate this insight when we have enough data (non-null rate).
        // A null rate means insufficient history — do NOT treat it as zero.
        Object repeatRate = analyticsRepository.findRepeatCustomerRate(creatorId);
        Double repeatRateValue = extractRepeatRate(repeatRate);
        if (repeatRateValue != null && repeatRateValue < 30.0) {
            insights.add(ruleBasedInsight(
                "Your repeat customer rate is below average.",
                "Consider announcing a 'returning customer discount' in your next drop description."
            ));
        }
        
        // Rule 2: Last drop sold out in under 2 hours
        List<Object[]> fastDrops = analyticsRepository.findFastestSellingDrops(creatorId);
        if (!fastDrops.isEmpty() && extractHoursToSellout(fastDrops.get(0)) < 2) {
            insights.add(ruleBasedInsight(
                "Your last drop sold out in under 2 hours!",
                "Consider increasing max_orders for your next drop, or running a second drop the same week."
            ));
        }
        
        // Rule 3: Best day insight — only if there is actually data
        List<Object[]> bestDay = analyticsRepository.findBestDayOfWeekForCreator(creatorId);
        if (!bestDay.isEmpty()) {
            String bestDayName = extractDayName(bestDay.get(0));
            if (bestDayName != null && !bestDayName.isBlank() && !bestDayName.equals("Unknown")) {
                insights.add(ruleBasedInsight(
                    "Your drops perform best on " + bestDayName + ".",
                    "Consider scheduling future drops around " + bestDayName + "s."
                ));
            }
        }
        
        return insights;
    }

    // --- Helper Formatting Methods ---

    private String formatList(Object data) {
        if (!(data instanceof List<?> list) || list.isEmpty()) return "N/A";
        StringBuilder sb = new StringBuilder();
        for (Object item : list) {
            sb.append(formatObjectArray(item)).append("; ");
        }
        return sb.toString();
    }

    private String formatObjectArray(Object data) {
        if (data == null) return "N/A";
        if (data instanceof Object[] arr) {
            return java.util.Arrays.toString(arr);
        }
        return data.toString();
    }



    /**
     * Returns null when there is no repeat customer data at all (insufficient history),
     * so callers can distinguish between "the rate is actually 0" and "no data yet".
     */
    private Double extractRepeatRate(Object repeatRateObj) {
        if (repeatRateObj == null) return null;
        if (repeatRateObj instanceof Object[] row && row.length > 2) {
            if (row[2] instanceof Number) {
                return ((Number) row[2]).doubleValue();
            }
        }
        // The query returned a row but the rate column is not populated — treat as no data
        return null;
    }

    private Integer extractHoursToSellout(Object[] dropData) {
        if (dropData != null && dropData.length > 3 && dropData[3] instanceof Number) {
            return ((Number) dropData[3]).intValue();
        }
        return 0;
    }

    private String extractDayName(Object[] dayData) {
        if (dayData != null && dayData.length > 0 && dayData[0] != null) {
            return dayData[0].toString();
        }
        return "Unknown";
    }

    private InsightResponse ruleBasedInsight(String insightText, String recommendation) {
        return InsightResponse.builder()
                .insight("[Rule-based Insight] " + insightText + " " + recommendation)

                .generatedAt(LocalDateTime.now())
                .build();
    }
}

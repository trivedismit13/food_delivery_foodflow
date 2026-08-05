package com.foodflow.ai;

import com.foodflow.dto.response.InsightResponse;
import com.foodflow.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RAGInsightStrategy implements InsightStrategy {

    private final AnalyticsService analyticsService;
    private final LLMClient llmClient;

    @Override
    public InsightResponse generateInsight(Long restaurantId, String query) {
        // RETRIEVAL PHASE: Get actual data for grounding
        List<Object[]> topDishes = analyticsService.getTopDishes(restaurantId, 5);
        // We would also fetch revenue trends, cancellation rates, etc.
        // Simplifying the context for the demo
        
        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("Top Dishes Data: \n");
        for (Object[] dish : topDishes) {
            contextBuilder.append("- ").append(dish[0]).append(": ").append(dish[1]).append(" sold\n");
        }

        // AUGMENTATION PHASE: Build the prompt
        String prompt = String.format(
                "You are an expert food delivery analytics assistant. \n" +
                "Here is the recent data for the restaurant:\n%s\n" +
                "Question: %s\n" +
                "Answer based ONLY on the data provided.", 
                contextBuilder.toString(), query
        );

        // GENERATION PHASE: Call LLM
        String generatedInsight = llmClient.generateText(prompt);

        return InsightResponse.builder()
                .question(query)
                .insight(generatedInsight)
                .supportingData(topDishes) // Return raw data alongside the text insight
                .confidence(0.5)
                .build();
    }

    @Override
    public boolean supports(String queryType) {
        return "RAG".equalsIgnoreCase(queryType) || "OPEN_ENDED".equalsIgnoreCase(queryType);
    }
}

package com.foodflow.service;

import com.foodflow.repository.AnalyticsRepository;
import com.foodflow.service.impl.InsightService;
import com.foodflow.dto.response.InsightResponse;
import com.foodflow.service.security.CreatorAuthorizationService;
import com.foodflow.repository.FoodDropRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AnalyticsServiceTest {

    @Mock
    private AnalyticsRepository analyticsRepository;

    @Mock
    private FoodDropRepository dropRepository;

    @Mock
    private LlmClient llmClient;

    @Mock
    private CreatorAuthorizationService creatorAuthorizationService;

    @InjectMocks
    private InsightService insightService;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    @Test
    void testTopReelsUploaders() {
        Object[] row1 = new Object[]{"Pizza Palace", 5L};
        when(analyticsRepository.findTopReelsUploaders()).thenReturn(Collections.singletonList(row1));

        List<Object[]> result = analyticsService.getTopReelsUploaders();
        assertEquals(1, result.size());
        assertEquals("Pizza Palace", result.get(0)[0]);
        assertEquals(5L, result.get(0)[1]);
    }

    @Test
    void testFindTopDishesInCityOfRestaurant() {
        Object[] row = new Object[]{"Margherita", 100L};
        when(analyticsRepository.findTopDishesInCityOfRestaurant(1L)).thenReturn(Collections.singletonList(row));

        List<Object[]> result = analyticsService.getTopDishesInCity(1L);
        assertEquals(1, result.size());
        assertEquals("Margherita", result.get(0)[0]);
    }

    @Test
    void testGenerateAutoInsights_BestDay() {
        Long creatorId = 1L;
        doNothing().when(creatorAuthorizationService).assertCreatorOwnsAnalytics(creatorId);

        Object[] bestDayRow = new Object[]{"Saturday", 95.0, 5L, 20.0};
        when(analyticsRepository.findBestDayOfWeekForCreator(creatorId)).thenReturn(Collections.singletonList(bestDayRow));
        when(analyticsRepository.findRepeatCustomerRate(creatorId)).thenReturn(new Object[]{100, 100, 50.0});
        when(analyticsRepository.findFastestSellingDrops(creatorId)).thenReturn(Collections.emptyList());

        List<InsightResponse> insights = insightService.generateAutoInsights(creatorId);
        
        assertEquals(1, insights.size());
        assertTrue(insights.get(0).getInsight().contains("Saturdays"));
        assertTrue(insights.get(0).getInsight().contains("Saturday"));
        assertNotNull(insights.get(0).getConfidence());
        assertEquals(1.0, insights.get(0).getConfidence());
    }

    @Test
    void testGenerateCreatorInsight() {
        Long creatorId = 1L;
        String question = "What should I do next?";
        
        doNothing().when(creatorAuthorizationService).assertCreatorOwnsAnalytics(creatorId);
        when(llmClient.generate(anyString())).thenReturn("This is a placeholder insight because real LLM inference is not currently connected.");
        
        InsightResponse response = insightService.generateCreatorInsight(creatorId, question);
        
        assertNotNull(response);
        assertEquals(question, response.getQuestion());
        assertTrue(response.getInsight().contains("placeholder"));
        assertNull(response.getConfidence());
    }
}

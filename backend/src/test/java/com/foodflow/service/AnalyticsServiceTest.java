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
    }

    @Test
    void testCreatorDashboardMetrics() {
        Long creatorId = 1L;
        int days = 7;

        when(analyticsRepository.findTotalUniqueCustomers(creatorId, days)).thenReturn(50);
        when(analyticsRepository.findWeeklyRevenueTrend(creatorId, days / 7)).thenReturn(Collections.emptyList());
        when(analyticsRepository.findRepeatCustomerRate(creatorId)).thenReturn(new Object[]{10, 100, 10.0});

        Object[] prevStats = new Object[]{new java.math.BigDecimal("100.00"), 5};
        when(analyticsRepository.findPreviousPeriodStats(creatorId, days)).thenReturn(prevStats);

        Object[] dropStats = new Object[]{10, 8, 85.5};
        when(analyticsRepository.findCreatorDropStats(creatorId)).thenReturn(dropStats);

        com.foodflow.dto.response.CreatorDashboardResponse response = analyticsService.getCreatorDashboard(creatorId, "LAST_7_DAYS");

        assertEquals(50, response.getTotalUniqueCustomers());
        assertEquals(10, response.getTotalDrops());
        assertEquals(8, response.getCompletedDrops());
        assertEquals(85.5, response.getAvgDropFillRate());

        // Since weeklyTrend is empty, current revenue is 0 and current orders is 0.
        // Prev rev is 100, so revenueChange should be ((0 - 100) / 100) * 100 = -100%
        assertEquals(0, response.getRevenueChange().compareTo(new java.math.BigDecimal("-100.00")));
        
        // Prev orders is 5, current is 0. ordersChange should be ((0 - 5) / 5) * 100 = -100%
        assertEquals(-100, response.getOrdersChange());
    }
}

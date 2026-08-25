package com.foodflow.controller;

import com.foodflow.dto.response.*;
import com.foodflow.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/creators/{creatorId}/analytics")
@RequiredArgsConstructor
public class CreatorAnalyticsController {

    private final AnalyticsService analyticsService;
    private final com.foodflow.service.impl.InsightService insightService;
    private final com.foodflow.service.security.CreatorAuthorizationService authorizationService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<CreatorDashboardResponse>> getDashboard(
            @PathVariable Long creatorId,
            @RequestParam(defaultValue = "WEEK") String period) {
        authorizationService.assertCreatorOwnsAnalytics(creatorId);
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCreatorDashboard(creatorId, period)));
    }

    @GetMapping("/weekly-trend")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<WeeklyTrendResponse>>> getWeeklyTrend(
            @PathVariable Long creatorId,
            @RequestParam(defaultValue = "12") int weeks) {
        authorizationService.assertCreatorOwnsAnalytics(creatorId);
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCreatorWeeklyTrend(creatorId, weeks)));
    }

    @GetMapping("/top-items")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<TopItemResponse>>> getTopItems(
            @PathVariable Long creatorId,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        authorizationService.assertCreatorOwnsAnalytics(creatorId);
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCreatorTopItems(creatorId, pageable)));
    }

    @GetMapping("/repeat-customers")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<RepeatCustomerResponse>> getRepeatCustomers(
            @PathVariable Long creatorId) {
        authorizationService.assertCreatorOwnsAnalytics(creatorId);
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCreatorRepeatCustomerRate(creatorId)));
    }

    @GetMapping("/drop-performance")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<DropPerformanceResponse>>> getDropPerformance(
            @PathVariable Long creatorId,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        authorizationService.assertCreatorOwnsAnalytics(creatorId);
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getDropPerformanceHistory(creatorId, pageable)));
    }

    @GetMapping("/best-day")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<BestDayResponse>> getBestDay(
            @PathVariable Long creatorId) {
        authorizationService.assertCreatorOwnsAnalytics(creatorId);
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getBestDayOfWeek(creatorId)));
    }

    // --- AI Insight ---

    @PostMapping("/insight")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<InsightResponse>> askInsight(
            @PathVariable Long creatorId,
            @RequestBody Map<String, String> request) {
        authorizationService.assertCreatorOwnsAnalytics(creatorId);
        String question = request.getOrDefault("question", "");
        return ResponseEntity.ok(ApiResponse.success(insightService.generateCreatorInsight(creatorId, question)));
    }

    @GetMapping("/insight/auto")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<ApiResponse<List<InsightResponse>>> getAutoInsight(
            @PathVariable Long creatorId) {
        authorizationService.assertCreatorOwnsAnalytics(creatorId);
        return ResponseEntity.ok(ApiResponse.success(insightService.generateAutoInsights(creatorId)));
    }
}

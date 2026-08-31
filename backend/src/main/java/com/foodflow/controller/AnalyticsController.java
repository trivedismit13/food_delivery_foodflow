package com.foodflow.controller;

import com.foodflow.dto.response.AnalyticsResponse;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.CuisineRevenueResponse;
import com.foodflow.dto.response.RestaurantCityRankResponse;
import com.foodflow.dto.response.TopDishResponse;
import com.foodflow.repository.RevenueRankProjection;
import com.foodflow.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/restaurants/{id}/top-dishes")
    public ResponseEntity<ApiResponse<List<TopDishResponse>>> getTopDishes(@PathVariable Long id, @RequestParam(defaultValue = "5") int limit) {
        List<TopDishResponse> responses = analyticsService.getTopDishes(id, limit).stream()
                .map(obj -> TopDishResponse.builder()
                        .itemName((String) obj[0])
                        .totalOrders(((Number) obj[1]).longValue())
                        .revenue(new BigDecimal(obj[2].toString()))
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/users/{id}/recent-orders")
    public ResponseEntity<ApiResponse<List<Object[]>>> getRecentOrders(@PathVariable Long id, @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getRecentOrders(id, days)));
    }

    @GetMapping("/revenue/total")
    public ResponseEntity<ApiResponse<Double>> getTotalRevenue(@RequestParam(defaultValue = "LAST_YEAR") String period) {
        int days = period.equals("LAST_YEAR") ? 365 : 30; // simplify logic for now
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTotalRevenue(days)));
    }

    @GetMapping("/restaurants/top-rated")
    public ResponseEntity<ApiResponse<List<Object[]>>> getTopRatedRestaurants(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTopRatedRestaurants(limit)));
    }

    @GetMapping("/customers/multi-restaurant")
    public ResponseEntity<ApiResponse<List<Object[]>>> getCustomersMultiRestaurant() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCustomersMultiRestaurant()));
    }

    @GetMapping("/restaurants/above-average-order-value")
    public ResponseEntity<ApiResponse<List<Object[]>>> getRestaurantsAboveAverageOrderValue() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getRestaurantsAboveAverageOrderValue()));
    }

    @GetMapping("/orders/uncollected-cancelled")
    public ResponseEntity<ApiResponse<List<AnalyticsResponse>>> getUncollectedCancelledOrders() {
        return ResponseEntity.ok(ApiResponse.success(
            analyticsService.getUncollectedCancelledOrders().stream().map(row ->
                AnalyticsResponse.builder()
                    .metricName("Order ID: " + row[0])
                    .metricValue("Amount: $" + row[1] + ", Method: " + row[2])
                    .build()
            ).collect(Collectors.toList())
        ));
    }

    @GetMapping("/revenue/by-cuisine")
    public ResponseEntity<ApiResponse<List<CuisineRevenueResponse>>> getRevenueByCuisine() {
        List<CuisineRevenueResponse> responses = analyticsService.getRevenueByCuisine().stream()
                .map(obj -> CuisineRevenueResponse.builder()
                        .cuisine((String) obj[0])
                        .totalRevenue(new BigDecimal(obj[1].toString()))
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/restaurants/revenue-rank-by-city")
    public ResponseEntity<ApiResponse<List<RestaurantCityRankResponse>>> getRevenueRankByCity() {
        List<RestaurantCityRankResponse> responses = analyticsService.getRevenueRankByCity().stream()
                .map(proj -> RestaurantCityRankResponse.builder()
                        .restaurantName(proj.getName())
                        .city(proj.getCity())
                        .revenue(new BigDecimal(proj.getRevenue().toString()))
                        .rankInCity(proj.getRankInCity())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/restaurants/revenue-category")
    public ResponseEntity<ApiResponse<?>> getRevenueCategory() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getRevenueCategory()));
    }

    @GetMapping("/restaurants/{id}/top-dishes-in-city")
    public ResponseEntity<ApiResponse<List<Object[]>>> getTopDishesInCity(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTopDishesInCity(id)));
    }

    @GetMapping("/customers/most-loyal")
    public ResponseEntity<ApiResponse<List<Object[]>>> getMostLoyalCustomers(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getMostLoyalCustomers(limit)));
    }

    @GetMapping("/restaurants/top-reels-uploaders")
    public ResponseEntity<ApiResponse<List<Object[]>>> getTopReelsUploaders() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTopReelsUploaders()));
    }

    @GetMapping("/restaurants/highest-rated-dish")
    public ResponseEntity<ApiResponse<List<Object[]>>> getHighestRatedDish() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getHighestRatedDish()));
    }

}

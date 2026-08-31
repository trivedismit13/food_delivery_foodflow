package com.foodflow.service;

import com.foodflow.repository.RevenueCategoryProjection;
import com.foodflow.repository.RevenueRankProjection;

import java.util.List;

public interface AnalyticsService {
    List<Object[]> getTopDishes(Long restaurantId, int limit);
    List<Object[]> getRecentOrders(Long userId, int days);
    Double getTotalRevenue(int days);
    List<Object[]> getTopRatedRestaurants(int limit);
    List<Object[]> getCustomersMultiRestaurant();
    List<Object[]> getRestaurantsAboveAverageOrderValue();
    List<Object[]> getRevenueByCuisine();
    List<RevenueRankProjection> getRevenueRankByCity();
    List<RevenueCategoryProjection> getRevenueCategory();
    List<Object[]> getTopDishesInCity(Long restaurantId);
    List<Object[]> getMostLoyalCustomers(int limit);
    List<Object[]> getTopReelsUploaders();
    List<Object[]> getHighestRatedDish();
    List<Object[]> getUncollectedCancelledOrders();

    com.foodflow.dto.response.CreatorDashboardResponse getCreatorDashboard(Long creatorId, String period);
    List<com.foodflow.dto.response.WeeklyTrendResponse> getCreatorWeeklyTrend(Long creatorId, int weeks);
    org.springframework.data.domain.Page<com.foodflow.dto.response.TopItemResponse> getCreatorTopItems(Long creatorId, org.springframework.data.domain.Pageable pageable);
    com.foodflow.dto.response.RepeatCustomerResponse getCreatorRepeatCustomerRate(Long creatorId);
    org.springframework.data.domain.Page<com.foodflow.dto.response.DropPerformanceResponse> getDropPerformanceHistory(Long creatorId, org.springframework.data.domain.Pageable pageable);
    com.foodflow.dto.response.BestDayResponse getBestDayOfWeek(Long creatorId);
}

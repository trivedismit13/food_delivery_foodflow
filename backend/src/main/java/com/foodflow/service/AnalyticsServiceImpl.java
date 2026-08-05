package com.foodflow.service;

import com.foodflow.repository.AnalyticsRepository;
import com.foodflow.repository.RevenueCategoryProjection;
import com.foodflow.repository.RevenueRankProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    @Override
    public List<Object[]> getTopDishes(Long restaurantId, int limit) {
        return analyticsRepository.findTopDishesByRestaurant(restaurantId, limit);
    }

    @Override
    public List<Object[]> getRecentOrders(Long userId, int days) {
        return analyticsRepository.findRecentOrdersByUser(userId, days);
    }

    @Override
    public Double getTotalRevenue(int days) {
        return analyticsRepository.findTotalRevenue(days);
    }

    @Override
    public List<Object[]> getTopRatedRestaurants(int limit) {
        return analyticsRepository.findTopRatedRestaurants(limit);
    }

    @Override
    public List<Object[]> getCustomersMultiRestaurant() {
        return analyticsRepository.findCustomersMultiRestaurant();
    }

    @Override
    public List<Object[]> getRestaurantsAboveAverageOrderValue() {
        return analyticsRepository.findRestaurantsAboveAverageOrderValue();
    }

    @Override
    public List<Object[]> getRevenueByCuisine() {
        return analyticsRepository.findRevenueByCuisine();
    }

    @Override
    public List<RevenueRankProjection> getRevenueRankByCity() {
        return analyticsRepository.findRevenueRankByCity();
    }

    @Override
    public List<RevenueCategoryProjection> getRevenueCategory() {
        return analyticsRepository.findRevenueCategory();
    }

    @Override
    public List<Object[]> getTopDishesInCity(Long restaurantId) {
        return analyticsRepository.findTopDishesInCityOfRestaurant(restaurantId);
    }

    @Override
    public List<Object[]> getMostLoyalCustomers(int limit) {
        return analyticsRepository.findMostLoyalCustomers(limit);
    }

    @Override
    public List<Object[]> getTopReelsUploaders() {
        return analyticsRepository.findTopReelsUploaders();
    }

    @Override
    public List<Object[]> getHighestRatedDish() {
        return analyticsRepository.findHighestRatedDish();
    }

    @Override
    public List<Object[]> getCancelledOrdersWithFailedPayment() {
        return analyticsRepository.findCancelledOrdersWithFailedPayment();
    }

    @Override
    public com.foodflow.dto.response.CreatorDashboardResponse getCreatorDashboard(Long creatorId, String period) {
        int days = period.equals("LAST_30_DAYS") ? 30 : 7;
        com.foodflow.dto.response.CreatorDashboardResponse res = new com.foodflow.dto.response.CreatorDashboardResponse();
        res.setCreatorId(creatorId);
        res.setPeriod(period);
        
        Object summaryObj = analyticsRepository.findCreatorSummary(creatorId);
        if (summaryObj instanceof Object[] summaryRow && summaryRow.length > 4) {
            res.setCreatorName((String) summaryRow[1]);
            res.setFollowerCount(((Number) summaryRow[3]).intValue());
        }

        List<Object[]> weeklyTrend = analyticsRepository.findWeeklyRevenueTrend(creatorId, days / 7);
        java.math.BigDecimal totalRev = java.math.BigDecimal.ZERO;
        int totalOrders = 0;
        int uniqueCustomers = 0;

        for (Object[] row : weeklyTrend) {
            totalOrders += ((Number) row[1]).intValue();
            totalRev = totalRev.add(new java.math.BigDecimal(row[2].toString()));
            uniqueCustomers += ((Number) row[3]).intValue();
        }

        res.setTotalRevenue(totalRev);
        res.setTotalOrders(totalOrders);
        res.setAvgOrderValue(totalOrders > 0 ? totalRev.divide(new java.math.BigDecimal(totalOrders), 2, java.math.RoundingMode.HALF_UP) : java.math.BigDecimal.ZERO);
        res.setRevenueChange(java.math.BigDecimal.ZERO); // Stub for previous period comparison
        res.setOrdersChange(0);
        
        Object repeatRate = analyticsRepository.findRepeatCustomerRate(creatorId);
        if (repeatRate instanceof Object[] repeatRow && repeatRow.length > 2) {
             res.setRepeatCustomerRate(((Number) repeatRow[2]).doubleValue());
        }

        res.setTotalUniqueCustomers(uniqueCustomers);
        res.setTotalDrops(0);
        res.setCompletedDrops(0);
        res.setAvgDropFillRate(0.0);
        return res;
    }

    @Override
    public List<com.foodflow.dto.response.WeeklyTrendResponse> getCreatorWeeklyTrend(Long creatorId, int weeks) {
        List<Object[]> trend = analyticsRepository.findWeeklyRevenueTrend(creatorId, weeks);
        List<com.foodflow.dto.response.WeeklyTrendResponse> result = new java.util.ArrayList<>();
        for (Object[] row : trend) {
            com.foodflow.dto.response.WeeklyTrendResponse res = new com.foodflow.dto.response.WeeklyTrendResponse();
            res.setWeek(row[0].toString());
            res.setOrders(((Number) row[1]).intValue());
            res.setRevenue(new java.math.BigDecimal(row[2].toString()));
            res.setUniqueCustomers(((Number) row[3]).intValue());
            result.add(res);
        }
        return result;
    }

    @Override
    public org.springframework.data.domain.Page<com.foodflow.dto.response.TopItemResponse> getCreatorTopItems(Long creatorId, org.springframework.data.domain.Pageable pageable) {
        List<Object[]> items = analyticsRepository.findTopItemsForCreator(creatorId);
        List<com.foodflow.dto.response.TopItemResponse> result = new java.util.ArrayList<>();
        for (Object[] row : items) {
            com.foodflow.dto.response.TopItemResponse res = new com.foodflow.dto.response.TopItemResponse();
            res.setItemName(row[0].toString());
            res.setTotalOrders(((Number) row[1]).intValue());
            res.setTotalRevenue(new java.math.BigDecimal(row[2].toString()));
            result.add(res);
        }
        return new org.springframework.data.domain.PageImpl<>(result, pageable, result.size());
    }

    @Override
    public com.foodflow.dto.response.RepeatCustomerResponse getCreatorRepeatCustomerRate(Long creatorId) {
        com.foodflow.dto.response.RepeatCustomerResponse res = new com.foodflow.dto.response.RepeatCustomerResponse();
        Object repeatRate = analyticsRepository.findRepeatCustomerRate(creatorId);
        if (repeatRate instanceof Object[] row && row.length > 2) {
            res.setRepeatCustomers(((Number) row[0]).intValue());
            res.setTotalCustomers(((Number) row[1]).intValue());
            res.setRepeatRatePercent(((Number) row[2]).doubleValue());
        } else {
            res.setRepeatCustomers(0);
            res.setTotalCustomers(0);
            res.setRepeatRatePercent(0.0);
        }
        return res;
    }

    @Override
    public org.springframework.data.domain.Page<com.foodflow.dto.response.DropPerformanceResponse> getDropPerformanceHistory(Long creatorId, org.springframework.data.domain.Pageable pageable) {
        List<Object[]> drops = analyticsRepository.findFastestSellingDrops(creatorId);
        List<com.foodflow.dto.response.DropPerformanceResponse> result = new java.util.ArrayList<>();
        for (Object[] row : drops) {
            com.foodflow.dto.response.DropPerformanceResponse res = new com.foodflow.dto.response.DropPerformanceResponse();
            res.setDropTitle(row[0].toString());
            res.setMaxOrders(((Number) row[1]).intValue());
            res.setCurrentOrders(((Number) row[2]).intValue());
            res.setHoursToSellout(((Number) row[3]).intValue());
            result.add(res);
        }
        return new org.springframework.data.domain.PageImpl<>(result, pageable, result.size());
    }

    @Override
    public com.foodflow.dto.response.BestDayResponse getBestDayOfWeek(Long creatorId) {
        com.foodflow.dto.response.BestDayResponse res = new com.foodflow.dto.response.BestDayResponse();
        List<Object[]> bestDay = analyticsRepository.findBestDayOfWeekForCreator(creatorId);
        if (!bestDay.isEmpty()) {
            Object[] row = bestDay.get(0);
            res.setDayOfWeek(row[0].toString());
            res.setAvgFillRate(((Number) row[1]).doubleValue());
            res.setDropCount(((Number) row[2]).intValue());
            res.setAvgOrdersPerDrop(row[3] != null ? ((Number) row[3]).doubleValue() : 0.0);
        } else {
            res.setDayOfWeek("N/A");
            res.setAvgFillRate(0.0);
            res.setDropCount(0);
            res.setAvgOrdersPerDrop(0.0);
        }
        return res;
    }
}

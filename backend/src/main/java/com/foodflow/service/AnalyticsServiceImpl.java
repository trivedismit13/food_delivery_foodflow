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
            res.setFollowerCount(summaryRow[3] != null ? ((Number) summaryRow[3]).intValue() : 0);
        }

        List<Object[]> weeklyTrend = analyticsRepository.findWeeklyRevenueTrend(creatorId, days / 7);
        java.math.BigDecimal totalRev = java.math.BigDecimal.ZERO;
        int totalOrders = 0;
        int uniqueCustomers = analyticsRepository.findTotalUniqueCustomers(creatorId, days) != null ? analyticsRepository.findTotalUniqueCustomers(creatorId, days) : 0;

        for (Object[] row : weeklyTrend) {
            totalOrders += row[1] != null ? ((Number) row[1]).intValue() : 0;
            if (row[2] != null) {
                totalRev = totalRev.add(new java.math.BigDecimal(row[2].toString()));
            }
        }

        res.setTotalRevenue(totalRev);
        res.setTotalOrders(totalOrders);
        res.setAvgOrderValue(totalOrders > 0 ? totalRev.divide(new java.math.BigDecimal(totalOrders), 2, java.math.RoundingMode.HALF_UP) : java.math.BigDecimal.ZERO);
        res.setRevenueChange(java.math.BigDecimal.ZERO); // Stub for previous period comparison
        res.setOrdersChange(0);
        
        Object repeatRate = analyticsRepository.findRepeatCustomerRate(creatorId);
        if (repeatRate instanceof Object[] repeatRow && repeatRow.length > 2) {
             res.setRepeatCustomerRate(repeatRow[2] != null ? ((Number) repeatRow[2]).doubleValue() : 0.0);
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
            res.setWeek(row[0] != null ? row[0].toString() : "N/A");
            res.setOrders(row[1] != null ? ((Number) row[1]).intValue() : 0);
            res.setRevenue(row[2] != null ? new java.math.BigDecimal(row[2].toString()) : java.math.BigDecimal.ZERO);
            res.setUniqueCustomers(row[3] != null ? ((Number) row[3]).intValue() : 0);
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
            res.setItemName(row[0] != null ? row[0].toString() : "N/A");
            res.setTotalOrders(row[1] != null ? ((Number) row[1]).intValue() : 0);
            res.setTotalRevenue(row[2] != null ? new java.math.BigDecimal(row[2].toString()) : java.math.BigDecimal.ZERO);
            result.add(res);
        }
        return new org.springframework.data.domain.PageImpl<>(result, pageable, result.size());
    }

    @Override
    public com.foodflow.dto.response.RepeatCustomerResponse getCreatorRepeatCustomerRate(Long creatorId) {
        com.foodflow.dto.response.RepeatCustomerResponse res = new com.foodflow.dto.response.RepeatCustomerResponse();
        Object repeatRate = analyticsRepository.findRepeatCustomerRate(creatorId);
        if (repeatRate instanceof Object[] row && row.length > 2) {
            res.setRepeatCustomers(row[0] != null ? ((Number) row[0]).intValue() : 0);
            res.setTotalCustomers(row[1] != null ? ((Number) row[1]).intValue() : 0);
            res.setRepeatRatePercent(row[2] != null ? ((Number) row[2]).doubleValue() : 0.0);
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
            res.setDropTitle(row[0] != null ? row[0].toString() : "N/A");
            res.setMaxOrders(row[1] != null ? ((Number) row[1]).intValue() : 0);
            res.setCurrentOrders(row[2] != null ? ((Number) row[2]).intValue() : 0);
            res.setHoursToSellout(row[3] != null ? ((Number) row[3]).intValue() : 0);
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
            res.setDayOfWeek(row[0] != null ? row[0].toString() : "N/A");
            res.setAvgFillRate(row[1] != null ? ((Number) row[1]).doubleValue() : 0.0);
            res.setDropCount(row[2] != null ? ((Number) row[2]).intValue() : 0);
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

package com.foodflow.repository;

public interface RevenueCategoryProjection {
    Long getRestaurantId();
    Double getMonthlyRev();
    String getRevenueCategory();
}

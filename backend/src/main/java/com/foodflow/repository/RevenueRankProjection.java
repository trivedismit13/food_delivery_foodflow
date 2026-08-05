package com.foodflow.repository;

import org.springframework.beans.factory.annotation.Value;

public interface RevenueRankProjection {
    String getName();
    String getCity();
    Double getRevenue();
    Integer getRankInCity();
}

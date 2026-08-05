package com.foodflow.service;

import com.foodflow.dto.request.SubmitRatingRequest;
import com.foodflow.dto.response.MonthlyTrendResponse;
import com.foodflow.dto.response.RatingBreakdownResponse;
import com.foodflow.dto.response.RatingResponse;
import com.foodflow.model.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RatingService {
    RatingResponse submitRating(Long userId, SubmitRatingRequest request);
    Page<Rating> getRestaurantRatings(Long restaurantId, Pageable pageable);
    RatingBreakdownResponse getRatingBreakdown(Long restaurantId);
    MonthlyTrendResponse getRatingTrends(Long restaurantId);
}

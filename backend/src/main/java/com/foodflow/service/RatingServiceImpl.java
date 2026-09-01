package com.foodflow.service;

import com.foodflow.dto.response.MonthlyTrendResponse;
import com.foodflow.dto.response.RatingBreakdownResponse;
import com.foodflow.dto.request.SubmitRatingRequest;
import com.foodflow.dto.response.RatingResponse;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.Rating;
import com.foodflow.model.Restaurant;
import com.foodflow.repository.RatingRepository;
import com.foodflow.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.foodflow.repository.OrderRepository;
import com.foodflow.repository.UserRepository;
import com.foodflow.exception.InvalidRequestException;
import com.foodflow.model.User;
import java.time.LocalDateTime;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public RatingResponse submitRating(Long userId, SubmitRatingRequest request) {
        if (!orderRepository.existsByUserUserIdAndRestaurantRestaurantIdAndStatus(
                userId, request.getRestaurantId(), com.foodflow.model.OrderStatus.COMPLETED)) {
            throw new InvalidRequestException("You can only rate restaurants you've ordered from");
        }

        if (ratingRepository.existsByUserUserIdAndRestaurantRestaurantId(userId, request.getRestaurantId())) {
            throw new InvalidRequestException("You've already rated this restaurant");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Rating rating = Rating.builder()
                .user(user)
                .restaurant(restaurant)
                .ratingValue(request.getRatingValue())
                .foodQualityRating(request.getFoodQualityRating())
                .packagingRating(request.getPackagingRating())
                .reviewText(request.getReviewText())
                .createdAt(LocalDateTime.now())
                .build();

        Rating savedRating = ratingRepository.save(rating);

        Map<String, Object> averages = ratingRepository.getRatingAverages(request.getRestaurantId());
        if (averages.get("avgOverall") != null) {
            BigDecimal newAvgRating = new BigDecimal(averages.get("avgOverall").toString())
                    .setScale(1, RoundingMode.HALF_UP);
            restaurantRepository.updateAvgRating(request.getRestaurantId(), newAvgRating);
        }

        return RatingResponse.builder()
            .ratingId(savedRating.getRatingId())
            .score(savedRating.getRatingValue().intValue())
            .reviewText(savedRating.getReviewText())
            .createdAt(savedRating.getCreatedAt() != null ? savedRating.getCreatedAt() : java.time.LocalDateTime.now())
            .customerName(user.getName())
            .build();
    }

    @Override
    public Page<Rating> getRestaurantRatings(Long restaurantId, Pageable pageable) {
        return ratingRepository.findByRestaurantRestaurantId(restaurantId, pageable);
    }

    @Override
    public RatingBreakdownResponse getRatingBreakdown(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        Map<String, Object> averages = ratingRepository.getRatingAverages(restaurantId);
        Long totalRatings = (Long) averages.get("totalRatings");

        if (totalRatings == null || totalRatings == 0) {
            return RatingBreakdownResponse.builder()
                    .restaurantId(restaurantId)
                    .restaurantName(restaurant.getName())
                    .totalRatings(0)
                    .build();
        }

        Map<Integer, Integer> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) distribution.put(i, 0);

        List<Object[]> distResults = ratingRepository.getRatingDistribution(restaurantId);
        for (Object[] row : distResults) {
            if (row[0] != null) {
                int rating = ((Number) row[0]).intValue();
                int count = ((Number) row[1]).intValue();
                if (rating >= 1 && rating <= 5) {
                    distribution.put(rating, count);
                }
            }
        }

        BigDecimal avgOverall = averages.get("avgOverall") != null ? new BigDecimal(averages.get("avgOverall").toString()).setScale(1, RoundingMode.HALF_UP) : null;
        BigDecimal avgFood = averages.get("avgFood") != null ? new BigDecimal(averages.get("avgFood").toString()).setScale(1, RoundingMode.HALF_UP) : null;
        BigDecimal avgPackaging = averages.get("avgPackaging") != null ? new BigDecimal(averages.get("avgPackaging").toString()).setScale(1, RoundingMode.HALF_UP) : null;

        // Simple trend mock
        String trend = "STABLE";
        String trendNote = "No significant change in the last 30 days";

        return RatingBreakdownResponse.builder()
                .restaurantId(restaurantId)
                .restaurantName(restaurant.getName())
                .overallRating(avgOverall)
                .breakdown(RatingBreakdownResponse.Breakdown.builder()
                        .foodQuality(avgFood)
                        .packaging(avgPackaging)
                        .build())
                .totalRatings(totalRatings.intValue())
                .ratingDistribution(distribution)
                .recentTrend(trend)
                .trendNote(trendNote)
                .build();
    }

    @Override
    public MonthlyTrendResponse getRatingTrends(Long restaurantId) {
        restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        // Mock implementation for the trend data
        Map<String, BigDecimal> data = new HashMap<>();
        data.put("2024-05", new BigDecimal("4.1"));
        data.put("2024-06", new BigDecimal("4.3"));

        return MonthlyTrendResponse.builder()
                .restaurantId(restaurantId)
                .metric("RATING")
                .monthlyData(data)
                .trendSummary("Rating is improving over the last 2 months")
                .build();
    }
}

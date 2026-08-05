package com.foodflow.repository;

import com.foodflow.model.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Page<Rating> findByRestaurantRestaurantId(Long restaurantId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT " +
            "AVG(r.ratingValue) as avgOverall, " +
            "AVG(r.foodQualityRating) as avgFood, " +
            "AVG(r.deliveryRating) as avgDelivery, " +
            "AVG(r.packagingRating) as avgPackaging, " +
            "COUNT(r) as totalRatings " +
            "FROM Rating r WHERE r.restaurant.restaurantId = :restaurantId")
    java.util.Map<String, Object> getRatingAverages(@org.springframework.data.repository.query.Param("restaurantId") Long restaurantId);

    @org.springframework.data.jpa.repository.Query("SELECT ROUND(r.ratingValue, 0) as roundedRating, COUNT(r) as count " +
            "FROM Rating r WHERE r.restaurant.restaurantId = :restaurantId GROUP BY ROUND(r.ratingValue, 0)")
    java.util.List<Object[]> getRatingDistribution(@org.springframework.data.repository.query.Param("restaurantId") Long restaurantId);

    boolean existsByUserUserIdAndRestaurantRestaurantId(Long userId, Long restaurantId);
}

package com.foodflow.repository;

import com.foodflow.model.CreatorFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CreatorFollowRepository extends JpaRepository<CreatorFollow, Long> {

    boolean existsByFollowerUserIdAndCreatorRestaurantId(Long followerId, Long creatorId);

    Optional<CreatorFollow> findByFollowerUserIdAndCreatorRestaurantId(
        Long followerId, Long creatorId);

    List<CreatorFollow> findByCreatorRestaurantId(Long creatorId);

    // Get all follower user IDs for sending notifications
    @Query("SELECT cf.follower.userId FROM CreatorFollow cf WHERE cf.creator.restaurantId = :creatorId")
    List<Long> findFollowerIdsByCreatorId(@Param("creatorId") Long creatorId);

    int countByCreatorRestaurantId(Long creatorId);
}

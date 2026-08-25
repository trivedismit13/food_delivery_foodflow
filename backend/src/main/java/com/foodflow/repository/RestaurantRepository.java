package com.foodflow.repository;

import com.foodflow.model.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, JpaSpecificationExecutor<Restaurant> {
    Page<Restaurant> findByCityIgnoreCase(String city, Pageable pageable);
    Page<Restaurant> findByCuisineIgnoreCase(String cuisine, Pageable pageable);
    Page<Restaurant> findByCityIgnoreCaseAndCuisineIgnoreCase(String city, String cuisine, Pageable pageable);

    java.util.List<Restaurant> findByIsAcceptingOrdersTrue();
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Restaurant r WHERE r.owner.userId = :ownerId")
    java.util.Optional<Restaurant> findByOwnerUserId(@org.springframework.data.repository.query.Param("ownerId") Long ownerId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Restaurant r SET r.totalOrdersCompleted = r.totalOrdersCompleted + 1 WHERE r.restaurantId = :id")
    void incrementTotalOrders(@org.springframework.data.repository.query.Param("id") Long id);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Restaurant r SET r.followerCount = r.followerCount + 1 WHERE r.restaurantId = :id")
    void incrementFollowerCount(@org.springframework.data.repository.query.Param("id") Long id);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Restaurant r SET r.followerCount = CASE WHEN r.followerCount > 0 THEN r.followerCount - 1 ELSE 0 END WHERE r.restaurantId = :id")
    void decrementFollowerCount(@org.springframework.data.repository.query.Param("id") Long id);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Restaurant r SET r.avgRating = :avgRating WHERE r.restaurantId = :id")
    void updateAvgRating(@org.springframework.data.repository.query.Param("id") Long id, @org.springframework.data.repository.query.Param("avgRating") java.math.BigDecimal avgRating);
}

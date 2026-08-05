package com.foodflow.repository;

import com.foodflow.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantRestaurantId(Long restaurantId);
    List<MenuItem> findByRestaurantRestaurantIdAndIsVegTrue(Long restaurantId);
    List<MenuItem> findByRestaurantRestaurantIdAndCategoryIgnoreCase(Long restaurantId, String category);
}

package com.foodflow.service;

import com.foodflow.model.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface RestaurantService {
    Restaurant createRestaurant(Restaurant restaurant);
    Optional<Restaurant> getRestaurantById(Long id);
    Page<Restaurant> getAllRestaurants(Pageable pageable);
    Page<Restaurant> searchRestaurants(String city, String cuisine, Pageable pageable);
    Restaurant updateRestaurant(Long id, Restaurant restaurant);
    void deleteRestaurant(Long id); // Soft delete
}

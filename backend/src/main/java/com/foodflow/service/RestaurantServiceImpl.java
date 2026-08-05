package com.foodflow.service;

import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.Restaurant;
import com.foodflow.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Override
    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    @Override
    public Optional<Restaurant> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    @Override
    public Page<Restaurant> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findAll(pageable);
    }

    @Override
    public Page<Restaurant> searchRestaurants(String city, String cuisine, Pageable pageable) {
        if (city != null && cuisine != null) {
            return restaurantRepository.findByCityIgnoreCaseAndCuisineIgnoreCase(city, cuisine, pageable);
        } else if (city != null) {
            return restaurantRepository.findByCityIgnoreCase(city, pageable);
        } else if (cuisine != null) {
            return restaurantRepository.findByCuisineIgnoreCase(cuisine, pageable);
        }
        return getAllRestaurants(pageable);
    }

    @Override
    public Restaurant updateRestaurant(Long id, Restaurant details) {
        return restaurantRepository.findById(id).map(r -> {
            r.setName(details.getName());
            r.setCity(details.getCity());
            r.setPincode(details.getPincode());
            r.setCuisine(details.getCuisine());
            return restaurantRepository.save(r);
        }).orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
    }

    @Override
    public void deleteRestaurant(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        restaurant.setIsOpen(false);
        restaurantRepository.save(restaurant);
    }
}

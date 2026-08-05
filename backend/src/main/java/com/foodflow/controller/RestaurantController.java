package com.foodflow.controller;

import com.foodflow.dto.request.CreateRestaurantRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<ApiResponse<Restaurant>> createRestaurant(@Valid @RequestBody CreateRestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        User owner = new User();
        owner.setUserId(request.getOwnerId());
        restaurant.setOwner(owner);
        restaurant.setName(request.getName());
        restaurant.setCity(request.getCity());
        restaurant.setPincode(request.getPincode());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setIsOpen(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(restaurantService.createRestaurant(restaurant)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Restaurant>>> getAllRestaurants(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getAllRestaurants(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> getRestaurantById(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id)
                .map(r -> ResponseEntity.ok(ApiResponse.success(r)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Restaurant not found", 404)));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<ApiResponse<Page<Restaurant>>> getRestaurantsByCity(@PathVariable String city, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.searchRestaurants(city, null, pageable)));
    }

    @GetMapping("/cuisine/{cuisine}")
    public ResponseEntity<ApiResponse<Page<Restaurant>>> getRestaurantsByCuisine(@PathVariable String cuisine, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.searchRestaurants(null, cuisine, pageable)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Restaurant>>> searchRestaurants(@RequestParam(required = false) String city,
                                                                           @RequestParam(required = false) String cuisine,
                                                                           Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.searchRestaurants(city, cuisine, pageable)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> updateRestaurant(@PathVariable Long id, @Valid @RequestBody CreateRestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        if (request.getOwnerId() != null) {
            User owner = new User();
            owner.setUserId(request.getOwnerId());
            restaurant.setOwner(owner);
        }
        restaurant.setName(request.getName());
        restaurant.setCity(request.getCity());
        restaurant.setPincode(request.getPincode());
        restaurant.setCuisine(request.getCuisine());
        return ResponseEntity.ok(ApiResponse.success(restaurantService.updateRestaurant(id, restaurant)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

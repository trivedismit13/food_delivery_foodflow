package com.foodflow.controller;

import com.foodflow.dto.request.CreateRestaurantRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.service.RestaurantService;
import com.foodflow.service.security.CreatorAuthorizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.foodflow.dto.response.RestaurantResponse;
import com.foodflow.dto.response.CreatorVerificationResponse;
import com.foodflow.model.CreatorVerification;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final CreatorAuthorizationService authorizationService;

    private RestaurantResponse mapToDto(Restaurant restaurant) {
        if (restaurant == null) return null;
        CreatorVerificationResponse verificationResponse = null;
        if (restaurant.getVerification() != null) {
            CreatorVerification v = restaurant.getVerification();
            verificationResponse = CreatorVerificationResponse.builder()
                .verificationId(v.getVerificationId())
                .currentLevel(v.getCurrentLevel())
                .levelUpdatedAt(v.getLevelUpdatedAt())
                .rejectionReason(v.getRejectionReason())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
        }
        
        return RestaurantResponse.builder()
                .restaurantId(restaurant.getRestaurantId())
                .ownerId(restaurant.getOwner() != null ? restaurant.getOwner().getUserId() : null)
                .name(restaurant.getName())
                .city(restaurant.getCity())
                .cuisine(restaurant.getCuisine())
                .isOpen(restaurant.getIsOpen())
                .creatorType(restaurant.getCreatorType() != null ? restaurant.getCreatorType().name() : null)
                .bio(restaurant.getBio())
                .instagramHandle(restaurant.getInstagramHandle())
                .pickupAddress(restaurant.getPickupAddress())
                .verificationLevel(restaurant.getVerificationLevel())
                .totalOrdersCompleted(restaurant.getTotalOrdersCompleted())
                .followerCount(restaurant.getFollowerCount())
                .avgRating(restaurant.getAvgRating())
                .isAcceptingOrders(restaurant.getIsAcceptingOrders())
                .announcement(restaurant.getAnnouncement())
                .verification(verificationResponse)
                .createdAt(restaurant.getCreatedAt())
                .build();
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> createRestaurant(@Valid @RequestBody CreateRestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        User owner = new User();
        owner.setUserId(request.getOwnerId());
        restaurant.setOwner(owner);
        restaurant.setName(request.getName());
        restaurant.setCity(request.getCity());
        restaurant.setPincode(request.getPincode());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setIsOpen(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(mapToDto(restaurantService.createRestaurant(restaurant))));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RestaurantResponse>>> getAllRestaurants(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getAllRestaurants(pageable).map(this::mapToDto)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        return restaurantService.getRestaurantById(id)
                .map(r -> ResponseEntity.ok(ApiResponse.success(mapToDto(r))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Restaurant not found", 404)));
    }



    @GetMapping("/cuisine/{cuisine}")
    public ResponseEntity<ApiResponse<Page<RestaurantResponse>>> getRestaurantsByCuisine(@PathVariable String cuisine, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.searchRestaurants(null, cuisine, pageable).map(this::mapToDto)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<RestaurantResponse>>> searchRestaurants(@RequestParam(required = false) String cuisine,
                                                                           Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.searchRestaurants(null, cuisine, pageable).map(this::mapToDto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(@PathVariable Long id, @Valid @RequestBody CreateRestaurantRequest request) {
        authorizationService.assertCreatorOwnsRestaurant(id);
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
        return ResponseEntity.ok(ApiResponse.success(mapToDto(restaurantService.updateRestaurant(id, restaurant))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        authorizationService.assertCreatorOwnsRestaurant(id);
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

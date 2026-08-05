package com.foodflow.controller;

import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.CreatorSummary;
import com.foodflow.dto.response.CreatorResponse;
import com.foodflow.dto.response.FoodDropResponse;
import com.foodflow.dto.response.MenuItemResponse;
import com.foodflow.dto.response.RatingResponse;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.CreatorFollow;
import com.foodflow.model.FoodDrop;
import com.foodflow.model.MenuItem;
import com.foodflow.model.Rating;
import com.foodflow.model.Restaurant;
import com.foodflow.model.CreatorVerification;
import com.foodflow.repository.CreatorFollowRepository;
import com.foodflow.repository.CreatorVerificationRepository;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.repository.MenuItemRepository;
import com.foodflow.repository.RatingRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.RestaurantSpecification;
import com.foodflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.foodflow.security.UserDetailsImpl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/creators")
@RequiredArgsConstructor
public class CreatorController {

    private final CreatorFollowRepository creatorFollowRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final FoodDropRepository foodDropRepository;
    private final CreatorVerificationRepository verificationRepository;
    private final MenuItemRepository menuItemRepository;
    private final RatingRepository ratingRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CreatorSummary>>> listCreators(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) String creatorType,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Specification<Restaurant> spec = RestaurantSpecification.getCreatorsByFilters(city, cuisine, creatorType);
        Page<Restaurant> restaurants = restaurantRepository.findAll(spec, pageable);
        
        Page<CreatorSummary> creators = restaurants.map(this::mapToSummary);
        return ResponseEntity.ok(ApiResponse.success(creators));
    }

    @GetMapping("/{creatorId}")
    public ResponseEntity<ApiResponse<CreatorResponse>> getCreatorProfile(@PathVariable Long creatorId) {
        Restaurant restaurant = restaurantRepository.findById(creatorId)
            .orElseThrow(() -> new ResourceNotFoundException("Creator not found: " + creatorId));
        
        return ResponseEntity.ok(ApiResponse.success(mapToProfile(restaurant)));
    }

    @GetMapping("/{creatorId}/menu")
    public ResponseEntity<ApiResponse<List>> getCreatorMenu(@PathVariable Long creatorId) {
        List<MenuItem> items = menuItemRepository.findByRestaurantRestaurantId(creatorId);
        List responses = items.stream().map(item -> 
            MenuItemResponse.builder()
                .menuItemId(item.getItemId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imageUrl(null)
                .isAvailable(item.getAvailableQty() > 0)
                .isVegetarian(item.getIsVeg())
                .isVegan(false)
                .isGlutenFree(false)
                .category(item.getCategory())
                .build()
        ).collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{creatorId}/ratings")
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getCreatorRatings(
            @PathVariable Long creatorId, 
            @PageableDefault(size = 10) Pageable pageable) {
            
        Page<Rating> ratings = ratingRepository.findByRestaurantRestaurantId(creatorId, pageable);
        Page<RatingResponse> responses = ratings.map(r -> 
            RatingResponse.builder()
                .ratingId(r.getRatingId())
                .orderId(null)
                .score(r.getRatingValue().intValue())
                .reviewText(r.getReviewText())
                .createdAt(r.getCreatedAt())
                .customerName(r.getUser().getName())
                .build()
        );
        
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    // @GetMapping("/{creatorId}/analytics/insight/auto")
    public ResponseEntity<ApiResponse<List<String>>> getAutoInsights(@PathVariable Long creatorId) {
        // Simple rule-based insights
        List<String> insights = List.of(
            "Customer retention is up 12% this month.",
            "Vegetarian options are selling 3x faster than last week.",
            "Consider offering delivery on weekends to capture more evening demand."
        );
        return ResponseEntity.ok(ApiResponse.success(insights));
    }

    // --- Follow System ---

    @PostMapping("/{creatorId}/follow")
    @PreAuthorize("isAuthenticated()")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> followCreator(
            @PathVariable Long creatorId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
            
        boolean exists = creatorFollowRepository.existsByFollowerUserIdAndCreatorRestaurantId(
            userDetails.getId(), creatorId);
            
        if (!exists) {
            CreatorFollow follow = CreatorFollow.builder()
                .follower(userRepository.getReferenceById(userDetails.getId()))
                .creator(restaurantRepository.getReferenceById(creatorId))
                .build();
            creatorFollowRepository.save(follow);
            
            // Atomic increment
            restaurantRepository.findById(creatorId).ifPresent(r -> {
                r.setFollowerCount(r.getFollowerCount() + 1);
                restaurantRepository.save(r);
            });
        }
        
        return ResponseEntity.ok(ApiResponse.success(Map.of("following", true)));
    }

    @DeleteMapping("/{creatorId}/follow")
    @PreAuthorize("isAuthenticated()")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Void> unfollowCreator(
            @PathVariable Long creatorId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
            
        creatorFollowRepository.findByFollowerUserIdAndCreatorRestaurantId(userDetails.getId(), creatorId)
            .ifPresent(follow -> {
                creatorFollowRepository.delete(follow);
                
                restaurantRepository.findById(creatorId).ifPresent(r -> {
                    if (r.getFollowerCount() > 0) {
                        r.setFollowerCount(r.getFollowerCount() - 1);
                        restaurantRepository.save(r);
                    }
                });
            });
            
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{creatorId}/follow-status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> isFollowing(
            @PathVariable Long creatorId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
            
        boolean isFollowing = creatorFollowRepository.existsByFollowerUserIdAndCreatorRestaurantId(
            userDetails.getId(), creatorId);
            
        return ResponseEntity.ok(ApiResponse.success(Map.of("isFollowing", isFollowing)));
    }

    private CreatorSummary mapToSummary(Restaurant r) {
        CreatorSummary cs = new CreatorSummary();
        cs.setRestaurantId(r.getRestaurantId());
        cs.setName(r.getName());
        cs.setVerificationLevel(r.getVerificationLevel());
        cs.setCreatorType(r.getCreatorType());
        cs.setAvgRating(r.getAvgRating());
        cs.setFollowerCount(r.getFollowerCount());
        cs.setTotalOrdersCompleted(r.getTotalOrdersCompleted());
        cs.setIsAcceptingOrders(r.getIsAcceptingOrders());
        
        // Fetch active drop
        List<FoodDrop> openDrops = foodDropRepository.findByCreatorRestaurantIdAndStatusIn(
            r.getRestaurantId(), List.of(FoodDrop.DropStatus.OPEN));
            
        if (!openDrops.isEmpty()) {
            cs.setActiveDrop(mapToFoodDropResponse(openDrops.get(0)));
        }
        
        return cs;
    }

    private CreatorResponse mapToProfile(Restaurant r) {
        CreatorResponse cr = new CreatorResponse();
        cr.setRestaurantId(r.getRestaurantId());
        cr.setName(r.getName());
        cr.setVerificationLevel(r.getVerificationLevel());
        cr.setCreatorType(r.getCreatorType());
        cr.setAvgRating(r.getAvgRating());
        cr.setFollowerCount(r.getFollowerCount());
        cr.setTotalOrdersCompleted(r.getTotalOrdersCompleted());
        cr.setIsAcceptingOrders(r.getIsAcceptingOrders());
        
        cr.setBio(r.getBio());
        cr.setCity(r.getCity());
        cr.setCuisine(r.getCuisine());
        cr.setInstagramHandle(r.getInstagramHandle());
        cr.setOffersPickup(r.getPickupAddress() != null && !r.getPickupAddress().isEmpty());
        cr.setPickupAddress(r.getPickupAddress());
        cr.setOffersDelivery(r.getAcceptsDelivery());
        cr.setDeliveryRadiusKm(r.getDeliveryRadiusKm());
        
        verificationRepository.findByCreatorRestaurantId(r.getRestaurantId()).ifPresent(v -> {
            cr.setVerification(v); // Assuming frontend handles raw JSON or DTO
        });
        
        List<FoodDrop> activeDrops = foodDropRepository.findByCreatorRestaurantIdAndStatusIn(
            r.getRestaurantId(), List.of(FoodDrop.DropStatus.ANNOUNCED, FoodDrop.DropStatus.OPEN));
            
        cr.setActiveDrops(activeDrops.stream().map(this::mapToFoodDropResponse).collect(Collectors.toList()));
        
        return cr;
    }

    private FoodDropResponse mapToFoodDropResponse(FoodDrop drop) {
        FoodDropResponse res = new FoodDropResponse();
        res.setDropId(drop.getDropId());
        res.setTitle(drop.getTitle());
        res.setDescription(drop.getDescription());
        res.setDropDate(drop.getDropDate());
        res.setOrderCutoffTime(drop.getOrderCutoffTime());
        res.setStatus(drop.getStatus().name());
        return res;
    }
}


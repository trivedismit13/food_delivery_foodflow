package com.foodflow.controller;

import com.foodflow.dto.request.UserRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.UserResponse;
import com.foodflow.model.User;
import com.foodflow.service.UserService;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.dto.response.CreatorSummary;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.foodflow.service.security.CreatorAuthorizationService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RestaurantRepository restaurantRepository;
    private final CreatorAuthorizationService authorizationService;



    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@org.springframework.security.core.annotation.AuthenticationPrincipal com.foodflow.security.UserDetailsImpl userDetails) {
        return userService.getUserById(userDetails.getId())
                .map(u -> {
                    UserResponse response = UserResponse.fromEntity(u);
                    if (com.foodflow.model.Role.SELLER.equals(u.getRole())) {
                        restaurantRepository.findByOwnerUserId(u.getUserId()).ifPresent(r -> {
                            response.setCreatorProfile(CreatorSummary.builder()
                                    .restaurantId(r.getRestaurantId())
                                    .name(r.getName())
                                    .creatorType(r.getCreatorType())
                                    .verificationLevel(r.getVerificationLevel())
                                    .avgRating(r.getAvgRating())
                                    .followerCount(r.getFollowerCount())
                                    .totalOrdersCompleted(r.getTotalOrdersCompleted())
                                    .isAcceptingOrders(r.getIsAcceptingOrders())
                                    .build());
                        });
                    }
                    return ResponseEntity.ok(ApiResponse.success(response));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found", 404)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        authorizationService.assertUserMatches(id);
        return userService.getUserById(id)
                .map(u -> {
                    UserResponse response = UserResponse.fromEntity(u);
                    if (com.foodflow.model.Role.SELLER.equals(u.getRole())) {
                        restaurantRepository.findByOwnerUserId(u.getUserId()).ifPresent(r -> {
                            response.setCreatorProfile(CreatorSummary.builder()
                                    .restaurantId(r.getRestaurantId())
                                    .name(r.getName())
                                    .creatorType(r.getCreatorType())
                                    .verificationLevel(r.getVerificationLevel())
                                    .avgRating(r.getAvgRating())
                                    .followerCount(r.getFollowerCount())
                                    .totalOrdersCompleted(r.getTotalOrdersCompleted())
                                    .isAcceptingOrders(r.getIsAcceptingOrders())
                                    .build());
                        });
                    }
                    return ResponseEntity.ok(ApiResponse.success(response));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found", 404)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        authorizationService.assertUserMatches(id);
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        return ResponseEntity.ok(ApiResponse.success(UserResponse.fromEntity(userService.updateUser(id, user))));
    }
}

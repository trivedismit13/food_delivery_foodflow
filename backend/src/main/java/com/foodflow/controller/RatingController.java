package com.foodflow.controller;

import com.foodflow.dto.request.SubmitRatingRequest;
import com.foodflow.dto.response.RatingResponse;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.MonthlyTrendResponse;
import com.foodflow.dto.response.RatingBreakdownResponse;
import com.foodflow.model.Rating;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.service.RatingService;
import com.foodflow.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/ratings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<RatingResponse>> submitRating(@AuthenticationPrincipal UserDetailsImpl principal, @Valid @RequestBody SubmitRatingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(ratingService.submitRating(principal.getId(), request)));
    }

    @GetMapping("/restaurants/{id}/ratings")
    public ResponseEntity<ApiResponse<Page<RatingResponse>>> getRestaurantRatings(@PathVariable Long id, Pageable pageable) {
        Page<RatingResponse> responses = ratingService.getRestaurantRatings(id, pageable).map(r -> RatingResponse.builder()
            .ratingId(r.getRatingId())
            .orderId(null)
            .score(r.getRatingValue().intValue())
            .reviewText(r.getReviewText())
            .createdAt(r.getCreatedAt())
            .customerName(r.getUser().getName())
            .build());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/restaurants/{id}/ratings/breakdown")
    public ResponseEntity<ApiResponse<RatingBreakdownResponse>> getRatingBreakdown(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(ratingService.getRatingBreakdown(id)));
    }

    @GetMapping("/restaurants/{id}/ratings/trends")
    public ResponseEntity<ApiResponse<MonthlyTrendResponse>> getRatingTrends(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(ratingService.getRatingTrends(id)));
    }
}

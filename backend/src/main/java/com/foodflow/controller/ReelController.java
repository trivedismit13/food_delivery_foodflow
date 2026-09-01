package com.foodflow.controller;

import com.foodflow.dto.request.ReelRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.ReelResponse;
import com.foodflow.model.Restaurant;
import com.foodflow.service.ReelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReelController {

    private final ReelService reelService;
    private final com.foodflow.service.security.CreatorAuthorizationService authorizationService;

    @PostMapping("/restaurants/{id}/reels")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<ReelResponse>> uploadReel(@PathVariable Long id, @Valid @RequestBody ReelRequest request) {
        authorizationService.assertCreatorOwnsRestaurant(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(reelService.uploadReel(id, request)));
    }

    @GetMapping("/restaurants/{id}/reels")
    public ResponseEntity<ApiResponse<Page<ReelResponse>>> getRestaurantReels(@PathVariable Long id, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(reelService.getRestaurantReels(id, pageable)));
    }

    @GetMapping("/reels")
    public ResponseEntity<ApiResponse<Page<ReelResponse>>> getDiscoveryFeed(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(reelService.getDiscoveryFeed(pageable)));
    }


}

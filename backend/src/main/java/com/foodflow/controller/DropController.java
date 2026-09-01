package com.foodflow.controller;

import com.foodflow.dto.request.*;
import com.foodflow.dto.response.*;
import com.foodflow.model.FoodDrop;
import com.foodflow.service.DropService;
import com.foodflow.service.DropOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.foodflow.security.UserDetailsImpl;
import com.foodflow.service.security.CreatorAuthorizationService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/drops")
@RequiredArgsConstructor
public class DropController {

    private final DropService dropService;
    private final DropOrderService dropOrderService;
    private final CreatorAuthorizationService authorizationService;

    // --- Creator Endpoints ---
    
    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<FoodDropResponse>> createDrop(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateDropRequest request) {
        FoodDropResponse drop = dropService.createDrop(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created(drop, "Drop created"));
    }

    @PutMapping("/{dropId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<FoodDropResponse>> updateDrop(
            @PathVariable Long dropId,
            @Valid @RequestBody UpdateDropRequest request) {
        authorizationService.assertCreatorOwnsDrop(dropId);
        return ResponseEntity.ok(ApiResponse.success(dropService.updateDrop(dropId, request)));
    }

    @PutMapping("/{dropId}/status")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ApiResponse<FoodDropResponse>> updateDropStatus(
            @PathVariable Long dropId,
            @RequestParam FoodDrop.DropStatus status) {
        authorizationService.assertCreatorOwnsDrop(dropId);
        return ResponseEntity.ok(ApiResponse.success(dropService.updateDropStatus(dropId, status)));
    }

    @PostMapping("/{dropId}/items")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> addItemToDrop(
            @PathVariable Long dropId,
            @Valid @RequestBody AddDropItemRequest request) {
        authorizationService.assertCreatorOwnsDrop(dropId);
        dropService.addItemToDrop(dropId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{dropId}/items/{itemId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> removeItemFromDrop(
            @PathVariable Long dropId,
            @PathVariable Long itemId) {
        authorizationService.assertCreatorOwnsDrop(dropId);
        dropService.removeItemFromDrop(dropId, itemId);
        return ResponseEntity.ok().build();
    }

    // --- Customer/Discovery Endpoints ---
    
    @GetMapping
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<FoodDropResponse>>> getActiveDropsFeed(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String query,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        
        org.springframework.data.domain.Page<FoodDropResponse> drops = dropService.getActiveDropsFeed(type, date, sortBy, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(drops));
    }

    @GetMapping("/following")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<FoodDropResponse>>> getFollowedCreatorDrops(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(dropService.getFollowedCreatorDrops(userDetails.getId(), pageable)));
    }

    @GetMapping("/{dropId}")
    public ResponseEntity<ApiResponse<FoodDropResponse>> getDropById(@PathVariable Long dropId) {
        return ResponseEntity.ok(ApiResponse.success(dropService.getDropById(dropId)));
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<FoodDropResponse>>> getCreatorDrops(
            @PathVariable Long creatorId,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(dropService.getCreatorDrops(creatorId, null, pageable)));
    }

    // --- Order Placement ---
    
    @PostMapping("/{dropId}/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderResponse>> placeDropOrder(
            @PathVariable Long dropId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody PlaceDropOrderRequest request) {
        request.setDropId(dropId);
        return ResponseEntity.ok(ApiResponse.success(dropOrderService.placeDropOrder(userDetails.getId(), request)));
    }

    @PostMapping("/{dropId}/orders/{orderId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('SELLER')")
    public ResponseEntity<ApiResponse<Void>> cancelDropOrder(
            @PathVariable Long dropId,
            @PathVariable Long orderId) {
        authorizationService.assertCanManageDropOrder(orderId, dropId);
        dropOrderService.cancelDropOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(null, "Order cancelled successfully", 200));
    }
}

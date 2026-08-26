package com.foodflow.controller;

import com.foodflow.dto.request.MenuItemRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.MenuItemResponse;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.MenuItem;
import com.foodflow.model.Restaurant;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.service.MenuItemService;
import com.foodflow.service.security.CreatorAuthorizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;
    private final RestaurantRepository restaurantRepository;
    private final CreatorAuthorizationService authorizationService;

    // ─── GET /api/menu-items/{restaurantId} ──────────────────────────────────
    @GetMapping("/{restaurantId}")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenuItems(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) Boolean veg,
            @RequestParam(required = false) String category) {

        List<MenuItemResponse> items = menuItemService
                .getMenuForRestaurant(restaurantId, veg, category)
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(items));
    }

    // ─── GET /api/menu-items/{restaurantId}/{menuItemId} ─────────────────────
    @GetMapping("/{restaurantId}/{menuItemId}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItem(
            @PathVariable Long restaurantId,
            @PathVariable Long menuItemId) {

        MenuItem item = menuItemService.getMenuItemById(menuItemId);

        // Verify the item belongs to the requested restaurant
        if (!item.getRestaurant().getRestaurantId().equals(restaurantId)) {
            throw new ResourceNotFoundException(
                    "Menu item " + menuItemId + " not found for restaurant " + restaurantId);
        }

        return ResponseEntity.ok(ApiResponse.success(mapToResponse(item)));
    }

    // ─── POST /api/menu-items/{restaurantId} ──────────────────────────────────────────────────
    @PostMapping("/{restaurantId}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(
            @PathVariable Long restaurantId,
            @Valid @RequestBody MenuItemRequest request) {

        authorizationService.assertCreatorOwnsRestaurant(restaurantId);
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found: " + restaurantId));

        MenuItem item = new MenuItem();
        item.setRestaurant(restaurant);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setIsVeg(request.getIsVeg());
        item.setCategory(request.getCategory());
        item.setAvailableQty(request.getAvailableQty());
        item.setIsDeleted(false);

        MenuItem created = menuItemService.createMenuItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(mapToResponse(created)));
    }

    // ─── PUT /api/menu-items/{restaurantId}/{menuItemId} ───────────────────────────────────────
    @PutMapping("/{restaurantId}/{menuItemId}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable Long restaurantId,
            @PathVariable Long menuItemId,
            @Valid @RequestBody MenuItemRequest request) {

        authorizationService.assertCreatorOwnsRestaurant(restaurantId);

        // Verify the item belongs to this restaurant
        MenuItem existing = menuItemService.getMenuItemById(menuItemId);
        if (!existing.getRestaurant().getRestaurantId().equals(restaurantId)) {
            throw new ResourceNotFoundException(
                    "Menu item " + menuItemId + " not found for restaurant " + restaurantId);
        }

        MenuItem details = new MenuItem();
        details.setName(request.getName());
        details.setDescription(request.getDescription());
        details.setPrice(request.getPrice());
        details.setIsVeg(request.getIsVeg());
        details.setCategory(request.getCategory());
        details.setAvailableQty(request.getAvailableQty());

        MenuItem updated = menuItemService.updateMenuItem(menuItemId, details);
        return ResponseEntity.ok(ApiResponse.success(mapToResponse(updated)));
    }

    // ─── DELETE /api/menu-items/{restaurantId}/{menuItemId} ───────────────────────────────────────────
    @DeleteMapping("/{restaurantId}/{menuItemId}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(
            @PathVariable Long restaurantId,
            @PathVariable Long menuItemId) {

        authorizationService.assertCreatorOwnsRestaurant(restaurantId);

        // Verify the item belongs to this restaurant
        MenuItem existing = menuItemService.getMenuItemById(menuItemId);
        if (!existing.getRestaurant().getRestaurantId().equals(restaurantId)) {
            throw new ResourceNotFoundException(
                    "Menu item " + menuItemId + " not found for restaurant " + restaurantId);
        }

        menuItemService.deleteMenuItem(menuItemId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // ─── Mapping helper ───────────────────────────────────────────────────────
    private MenuItemResponse mapToResponse(MenuItem item) {
        return MenuItemResponse.builder()
                .menuItemId(item.getItemId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imageUrl(null)
                .isAvailable(item.getAvailableQty() != null && item.getAvailableQty() > 0)
                .isVegetarian(item.getIsVeg())
                .isVegan(false)
                .isGlutenFree(false)
                .category(item.getCategory())
                .build();
    }
}

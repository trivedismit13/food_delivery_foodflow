package com.foodflow.controller;

import com.foodflow.dto.request.MenuItemRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.MenuItemResponse;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.MenuItem;
import com.foodflow.model.Restaurant;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.service.MenuItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MenuController {

    private final MenuItemService menuItemService;
    private final RestaurantRepository restaurantRepository;

    @PostMapping("/restaurants/{id}/menu")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found: " + id));

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

    @GetMapping("/restaurants/{id}/menu")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenuForRestaurant(@PathVariable Long id,
                                                                             @RequestParam(required = false) Boolean veg,
                                                                             @RequestParam(required = false) String category) {
        List<MenuItemResponse> responses = menuItemService.getMenuForRestaurant(id, veg, category)
                .stream()
                .map(this::mapToResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PutMapping("/menu/{itemId}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(@PathVariable Long itemId, @Valid @RequestBody MenuItemRequest request) {
        MenuItem item = new MenuItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setIsVeg(request.getIsVeg());
        item.setCategory(request.getCategory());
        item.setAvailableQty(request.getAvailableQty());
        return ResponseEntity.ok(ApiResponse.success(mapToResponse(menuItemService.updateMenuItem(itemId, item))));
    }

    @DeleteMapping("/menu/{itemId}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long itemId) {
        menuItemService.deleteMenuItem(itemId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    private MenuItemResponse mapToResponse(MenuItem item) {
        return MenuItemResponse.builder()
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
                .build();
    }
}

package com.foodflow.service;

import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.MenuItem;
import com.foodflow.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemServiceImpl implements MenuItemService {
    private final MenuItemRepository menuItemRepository;

    @Override
    public MenuItem createMenuItem(MenuItem item) {
        return menuItemRepository.save(item);
    }

    @Override
    public List<MenuItem> getMenuForRestaurant(Long restaurantId, Boolean vegOnly, String category) {
        if (Boolean.TRUE.equals(vegOnly)) {
            return menuItemRepository.findByRestaurantRestaurantIdAndIsVegTrue(restaurantId);
        } else if (category != null && !category.isEmpty()) {
            return menuItemRepository.findByRestaurantRestaurantIdAndCategoryIgnoreCase(restaurantId, category);
        }
        return menuItemRepository.findByRestaurantRestaurantId(restaurantId);
    }

    @Override
    public MenuItem updateMenuItem(Long itemId, MenuItem details) {
        return menuItemRepository.findById(itemId).map(item -> {
            item.setName(details.getName());
            item.setDescription(details.getDescription());
            item.setPrice(details.getPrice());
            item.setIsVeg(details.getIsVeg());
            item.setCategory(details.getCategory());
            item.setAvailableQty(details.getAvailableQty());
            return menuItemRepository.save(item);
        }).orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
    }

    @Override
    public void deleteMenuItem(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        menuItem.setIsDeleted(true);
        menuItemRepository.save(menuItem);
    }
}

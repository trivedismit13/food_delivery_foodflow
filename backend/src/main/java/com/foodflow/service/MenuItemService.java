package com.foodflow.service;

import com.foodflow.model.MenuItem;
import java.util.List;

public interface MenuItemService {
    MenuItem createMenuItem(MenuItem item);
    List<MenuItem> getMenuForRestaurant(Long restaurantId, Boolean vegOnly, String category);
    MenuItem getMenuItemById(Long itemId);
    MenuItem updateMenuItem(Long itemId, MenuItem item);
    void deleteMenuItem(Long itemId); // Soft delete
}

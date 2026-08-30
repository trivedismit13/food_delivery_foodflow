package com.foodflow.service;

import com.foodflow.model.Reel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReelService {
    Reel uploadReel(Long restaurantId, com.foodflow.dto.request.ReelRequest request);
    Page<Reel> getRestaurantReels(Long restaurantId, Pageable pageable);
    Page<Reel> getDiscoveryFeed(Pageable pageable);
}

package com.foodflow.service;

import com.foodflow.dto.request.ReelRequest;
import com.foodflow.dto.response.ReelResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReelService {
    ReelResponse uploadReel(Long restaurantId, ReelRequest request);
    Page<ReelResponse> getRestaurantReels(Long restaurantId, Pageable pageable);
    Page<ReelResponse> getDiscoveryFeed(Pageable pageable);
}

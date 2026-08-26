package com.foodflow.service;

import com.foodflow.model.FoodDrop;
import com.foodflow.dto.request.CreateDropRequest;
import com.foodflow.dto.request.UpdateDropRequest;
import com.foodflow.dto.request.AddDropItemRequest;
import com.foodflow.dto.response.FoodDropResponse;

import java.util.List;

public interface DropService {
    FoodDropResponse createDrop(Long creatorId, CreateDropRequest request);
    FoodDropResponse updateDrop(Long dropId, UpdateDropRequest request);
    FoodDropResponse updateDropStatus(Long dropId, FoodDrop.DropStatus newStatus);
    FoodDropResponse getDropById(Long dropId);
    org.springframework.data.domain.Page<FoodDropResponse> getCreatorDrops(Long creatorId, List<FoodDrop.DropStatus> statuses, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<FoodDropResponse> getActiveDropsFeed(String creatorType, String date, String sortBy, String query, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<FoodDropResponse> getFollowedCreatorDrops(Long userId, org.springframework.data.domain.Pageable pageable);
    void addItemToDrop(Long dropId, AddDropItemRequest request);
    void removeItemFromDrop(Long dropId, Long itemId);
}

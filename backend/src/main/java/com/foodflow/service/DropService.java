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
    List<FoodDropResponse> getCreatorDrops(Long creatorId, List<FoodDrop.DropStatus> statuses);
    org.springframework.data.domain.Page<FoodDropResponse> getActiveDropsFeed(Long cityId, Double lat, Double lng, String creatorType, String date, String sortBy, String query, org.springframework.data.domain.Pageable pageable);
    List<FoodDropResponse> getFollowedCreatorDrops(Long userId);
    void addItemToDrop(Long dropId, AddDropItemRequest request);
    void removeItemFromDrop(Long dropId, Long itemId);
}

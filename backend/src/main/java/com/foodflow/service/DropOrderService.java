package com.foodflow.service;

import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.dto.response.OrderResponse;

public interface DropOrderService {
    OrderResponse placeDropOrder(Long userId, PlaceDropOrderRequest request);
    void cancelDropOrder(Long orderId, Long userId);
}

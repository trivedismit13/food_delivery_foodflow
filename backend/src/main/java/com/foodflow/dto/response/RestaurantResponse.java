package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponse {
    private Long restaurantId;
    private Long ownerId;
    private String name;
    private Long cityId;
    private String city;
    private Double latitude;
    private Double longitude;
    private String pincode;
    private String cuisine;
    private Boolean isOpen;
    private String creatorType;
    private String bio;
    private String instagramHandle;
    private String pickupAddress;
    private Boolean acceptsDelivery;
    private Integer deliveryRadiusKm;
    private Integer verificationLevel;
    private Integer totalOrdersCompleted;
    private Integer followerCount;
    private BigDecimal avgRating;
    private Boolean isAcceptingOrders;
    private String announcement;
    private CreatorVerificationResponse verification;
    private LocalDateTime createdAt;
}

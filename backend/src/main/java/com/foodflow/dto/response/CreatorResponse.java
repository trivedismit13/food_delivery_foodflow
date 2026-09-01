package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@org.springframework.context.annotation.Configuration
@lombok.EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CreatorResponse extends CreatorSummary {
    private String bio;
    private String city;
    private String cuisine;
    private String instagramHandle;
    private Boolean offersPickup;
    private String pickupAddress;

    
    // Verifications and active drops
    private CreatorVerificationResponse verification;
    private List<FoodDropResponse> activeDrops;
}


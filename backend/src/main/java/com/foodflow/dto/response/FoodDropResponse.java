package com.foodflow.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodDropResponse {
    private Long dropId;
    private String title;
    private String description;
    private LocalDate dropDate;
    private LocalDateTime orderCutoffTime;
    private String pickupTime;
    private Integer maxOrders;
    private Integer currentOrders;
    private Integer availableSlots;
    private Boolean isSoldOut;

    private String status;
    private String dropPhotoUrl;
    private String specialNotes;
    
    private CreatorSummary creator;
    
    private List<DropItemResponse> items;
    
    private Long minutesUntilCutoff;
}

package com.foodflow.dto.request;

import jakarta.validation.constraints.Future;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UpdateDropRequest {
    private String title;
    private String description;
    @Future(message = "Drop date must be in the future")
    private LocalDate dropDate;
    @Future(message = "Order cutoff time must be in the future")
    private LocalDateTime orderCutoffTime;
    private LocalDateTime pickupStartTime;
    private LocalDateTime pickupEndTime;
    private Integer maxOrders;
    private Boolean isDeliveryAvailable;
    private BigDecimal deliveryCharge;
    private String dropPhotoUrl;
    private String specialNotes;
}

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
    private String pickupTime;
    private String pickupLocation;
    @jakarta.validation.constraints.Min(value = 1, message = "Max orders must be at least 1")
    private Integer maxOrders;

    private String dropPhotoUrl;
    private String specialNotes;

}

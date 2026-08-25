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
    @jakarta.validation.constraints.Min(value = 1, message = "Max orders must be at least 1")
    private Integer maxOrders;
    private Boolean isDeliveryAvailable;
    @jakarta.validation.constraints.PositiveOrZero(message = "Delivery charge must be positive or zero")
    private BigDecimal deliveryCharge;
    private String dropPhotoUrl;
    private String specialNotes;

    @jakarta.validation.constraints.AssertTrue(message = "Pickup start time must be before end time")
    public boolean isPickupTimeValid() {
        if (pickupStartTime == null || pickupEndTime == null) {
            return true;
        }
        return pickupStartTime.isBefore(pickupEndTime);
    }
}

package com.foodflow.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateDropRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Drop date is required")
    @Future(message = "Drop date must be in the future")
    private LocalDate dropDate;

    @NotNull(message = "Order cutoff time is required")
    @Future(message = "Order cutoff time must be in the future")
    private LocalDateTime orderCutoffTime;

    private LocalDateTime pickupStartTime;
    private LocalDateTime pickupEndTime;

    @NotNull(message = "Max orders is required")
    @jakarta.validation.constraints.Min(value = 1, message = "Max orders must be at least 1")
    private Integer maxOrders;

    private Boolean isDeliveryAvailable = false;
    
    @jakarta.validation.constraints.PositiveOrZero(message = "Delivery charge must be positive or zero")
    private BigDecimal deliveryCharge;

    private String dropPhotoUrl;
    private String specialNotes;

    @jakarta.validation.Valid
    private List<DropItemRequest> items;

    @jakarta.validation.constraints.AssertTrue(message = "Pickup start time must be before end time")
    public boolean isPickupTimeValid() {
        if (pickupStartTime == null || pickupEndTime == null) {
            return true;
        }
        return pickupStartTime.isBefore(pickupEndTime);
    }

    @jakarta.validation.constraints.AssertTrue(message = "Order cutoff time must be before pickup start time")
    public boolean isCutoffBeforePickup() {
        if (orderCutoffTime == null || pickupStartTime == null) {
            return true;
        }
        return orderCutoffTime.isBefore(pickupStartTime);
    }
}

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
    private Integer maxOrders;

    private Boolean isDeliveryAvailable = false;
    private BigDecimal deliveryCharge;

    private String dropPhotoUrl;
    private String specialNotes;

    private List<DropItemRequest> items;
}

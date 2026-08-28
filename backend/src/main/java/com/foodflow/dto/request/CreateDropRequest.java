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

    @NotBlank(message = "Pickup time description is required")
    private String pickupTime;

    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    @NotNull(message = "Max orders is required")
    @jakarta.validation.constraints.Min(value = 1, message = "Max orders must be at least 1")
    private Integer maxOrders;



    private String dropPhotoUrl;
    private String specialNotes;

    @jakarta.validation.Valid
    private List<DropItemRequest> items;

}

package com.foodflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRestaurantRequest {
    @NotNull(message = "Owner ID is required")
    private Long ownerId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "City is required")
    private String city;

    private String pincode;

    @NotBlank(message = "Cuisine is required")
    private String cuisine;
}

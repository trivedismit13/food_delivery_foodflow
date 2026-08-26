package com.foodflow.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatorRegistrationRequest {
    // User fields
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    // Creator / Restaurant fields
    @NotBlank(message = "Brand name is required")
    private String creatorName;

    @NotBlank(message = "Creator type is required")
    private String creatorType; // Enum string

    @NotBlank(message = "City is required")
    private String city;



    @NotBlank(message = "Cuisine is required")
    private String cuisine;

    private String bio;

    private Boolean offersPickup;
    private String pickupAddress;



    private String instagramHandle;
}

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

    private String city;

    @NotBlank(message = "What do you make is required")
    private String whatDoYouMake;




    private String bio;

    private String pickupLocation;
}

package com.foodflow.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatorRegistrationRequest {
    // User fields
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(max = 120, message = "Password must not exceed 120 characters")
    private String password;

    // Creator / Restaurant fields
    @NotBlank(message = "Brand name is required")
    @Size(max = 150, message = "Brand name must not exceed 150 characters")
    private String creatorName;

    @Size(max = 200, message = "City must not exceed 200 characters")
    private String city;

    @NotBlank(message = "What do you make is required")
    @Size(max = 50, message = "What do you make must not exceed 50 characters")
    private String whatDoYouMake;




    private String bio;

    private String pickupLocation;
}

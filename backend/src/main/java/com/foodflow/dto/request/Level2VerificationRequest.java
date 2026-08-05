package com.foodflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class Level2VerificationRequest {
    
    @NotBlank(message = "Food licence number is required")
    private String foodLicenceNumber;
    
    @NotBlank(message = "Food licence URL is required")
    private String foodLicenceUrl;
    
    @NotBlank(message = "Kitchen photo URL 1 is required")
    private String kitchenPhotoUrl1;
    
    @NotBlank(message = "Kitchen photo URL 2 is required")
    private String kitchenPhotoUrl2;
    
    @NotBlank(message = "Ingredient declaration is required")
    private String ingredientDeclaration;
}

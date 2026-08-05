package com.foodflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerificationRequest {
    
    @NotBlank(message = "Document URL is required")
    private String documentUrl;
    
    private String taxId;
    
    private String additionalInfo;
}

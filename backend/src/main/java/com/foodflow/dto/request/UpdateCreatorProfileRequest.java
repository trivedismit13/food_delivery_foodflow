package com.foodflow.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCreatorProfileRequest {
    @Size(max = 500)
    private String bio;
    
    @Size(max = 100)
    private String city;
    
    @Size(max = 255)
    private String pickupAddress;
    
    @Size(max = 100)
    private String instagramHandle;
    
    @Size(max = 50)
    private String cuisine;
}

package com.foodflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReelRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Media URL is required")
    @org.hibernate.validator.constraints.URL(message = "Media URL must be a valid URL")
    private String mediaUrl;
}

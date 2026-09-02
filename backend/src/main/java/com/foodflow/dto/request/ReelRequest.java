package com.foodflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReelRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Media URL is required")
    @jakarta.validation.constraints.Pattern(regexp = "^(http|https)://.*$", message = "Media URL must be a valid HTTP or HTTPS URL")
    private String mediaUrl;
}

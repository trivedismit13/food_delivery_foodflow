package com.foodflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReelRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Media URL is required")
    private String mediaUrl;
}

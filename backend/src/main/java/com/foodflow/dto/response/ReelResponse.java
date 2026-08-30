package com.foodflow.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReelResponse {
    private Long reelId;
    private String title;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private Long restaurantId;
    private String restaurantName;
}

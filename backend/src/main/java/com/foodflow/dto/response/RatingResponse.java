package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private Long ratingId;
    private Long orderId;
    private Integer score;
    private String reviewText;
    private LocalDateTime createdAt;
    private String customerName;
}

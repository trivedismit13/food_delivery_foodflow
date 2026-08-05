package com.foodflow.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SubmitRatingRequest {
    private Long userId;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotNull(message = "Overall rating is required")
    @DecimalMin("1.0") @DecimalMax("5.0")
    private BigDecimal ratingValue;

    @DecimalMin("1.0") @DecimalMax("5.0")
    private BigDecimal foodQualityRating;

    @DecimalMin("1.0") @DecimalMax("5.0")
    private BigDecimal deliveryRating;

    @DecimalMin("1.0") @DecimalMax("5.0")
    private BigDecimal packagingRating;

    private String reviewText;
}

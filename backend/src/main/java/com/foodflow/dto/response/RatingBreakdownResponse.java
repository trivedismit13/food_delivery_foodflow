package com.foodflow.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Map;
import java.math.BigDecimal;

@Data
@Builder
public class RatingBreakdownResponse {
    private Long restaurantId;
    private String restaurantName;
    private BigDecimal overallRating;
    private Breakdown breakdown;
    private Integer totalRatings;
    private Map<Integer, Integer> ratingDistribution;
    private String recentTrend;
    private String trendNote;

    @Data
    @Builder
    public static class Breakdown {
        private BigDecimal foodQuality;
        private BigDecimal deliveryExperience;
        private BigDecimal packaging;
    }
}

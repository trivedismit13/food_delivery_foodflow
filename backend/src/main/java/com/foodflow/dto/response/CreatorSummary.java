package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import com.foodflow.model.Restaurant.CreatorType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorSummary {
    private Long restaurantId;
    private String name;
    private CreatorType creatorType;
    private Integer verificationLevel;
    private BigDecimal avgRating;
    private Integer followerCount;
    private Integer totalOrdersCompleted;
    private Boolean isAcceptingOrders;
    private FoodDropResponse activeDrop;
}

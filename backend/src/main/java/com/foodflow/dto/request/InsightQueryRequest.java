package com.foodflow.dto.request;

import lombok.Data;

@Data
public class InsightQueryRequest {
    private Long restaurantId;
    private String question;
}

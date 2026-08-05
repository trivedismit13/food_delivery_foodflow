package com.foodflow.dto.response;

import lombok.Data;

@Data
public class BestDayResponse {
    private String dayOfWeek;
    private Double avgFillRate;
    private Integer dropCount;
    private Double avgOrdersPerDrop;
}

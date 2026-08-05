package com.foodflow.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DropPerformanceResponse {
    private String dropTitle;
    private Integer maxOrders;
    private Integer currentOrders;
    private Integer hoursToSellout;
    private LocalDate dropDate;
}

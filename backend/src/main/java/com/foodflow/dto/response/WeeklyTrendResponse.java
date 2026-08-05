package com.foodflow.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class WeeklyTrendResponse {
    private String week;
    private Integer orders;
    private BigDecimal revenue;
    private Integer uniqueCustomers;
}

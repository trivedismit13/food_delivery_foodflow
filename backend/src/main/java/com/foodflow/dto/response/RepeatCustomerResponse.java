package com.foodflow.dto.response;

import lombok.Data;

@Data
public class RepeatCustomerResponse {
    private Integer repeatCustomers;
    private Integer totalCustomers;
    private Double repeatRatePercent;
}

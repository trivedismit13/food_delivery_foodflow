package com.foodflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long paymentId;
    private Long orderId;
    private String method;
    private BigDecimal amount;
    private String status;
    private LocalDateTime paymentDate;
}

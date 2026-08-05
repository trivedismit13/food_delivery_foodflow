package com.foodflow.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DropUpdateMessage {
    private Long dropId;
    private Integer currentOrders;
    private Integer maxOrders;
    private Integer availableSlots;
    private Boolean isSoldOut;
    private LocalDateTime timestamp;
}

package com.foodflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class InsightResponse {
    private String question;
    private String insight;
    private Object supportingData;
    private Set<String> supportingDataKeys;

    private LocalDateTime generatedAt;
}

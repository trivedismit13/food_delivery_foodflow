package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorVerificationResponse {
    private Long verificationId;
    private Boolean aadhaarVerified;
    private Boolean phoneVerified;
    private String foodLicenceNumber;
    private String foodLicenceUrl;
    private String kitchenPhotoUrl1;
    private String kitchenPhotoUrl2;
    private String ingredientDeclaration;
    private Boolean inspectionPassed;
    private LocalDate inspectionDate;
    private String inspectionNotes;
    private Integer currentLevel;
    private LocalDateTime levelUpdatedAt;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

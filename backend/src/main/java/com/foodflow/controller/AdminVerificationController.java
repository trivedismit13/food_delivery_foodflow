package com.foodflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.foodflow.dto.response.CreatorVerificationResponse;
import com.foodflow.model.CreatorVerification;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class AdminVerificationController {
    private final com.foodflow.service.VerificationService verificationService;

    private CreatorVerificationResponse mapToDto(CreatorVerification verification) {
        if (verification == null) return null;
        return CreatorVerificationResponse.builder()
                .verificationId(verification.getVerificationId())
                .aadhaarVerified(verification.getAadhaarVerified())
                .phoneVerified(verification.getPhoneVerified())
                .foodLicenceNumber(verification.getFoodLicenceNumber())
                .foodLicenceUrl(verification.getFoodLicenceUrl())
                .kitchenPhotoUrl1(verification.getKitchenPhotoUrl1())
                .kitchenPhotoUrl2(verification.getKitchenPhotoUrl2())
                .ingredientDeclaration(verification.getIngredientDeclaration())
                .inspectionPassed(verification.getInspectionPassed())
                .inspectionDate(verification.getInspectionDate())
                .inspectionNotes(verification.getInspectionNotes())
                .currentLevel(verification.getCurrentLevel())
                .levelUpdatedAt(verification.getLevelUpdatedAt())
                .rejectionReason(verification.getRejectionReason())
                .createdAt(verification.getCreatedAt())
                .updatedAt(verification.getUpdatedAt())
                .build();
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<java.util.List<CreatorVerificationResponse>>> listPendingVerifications() {
        java.util.List<CreatorVerificationResponse> responses = verificationService.listPendingVerifications().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(responses));
    }

    @PutMapping("/{creatorId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<CreatorVerificationResponse>> approveVerification(
            @PathVariable Long creatorId,
            @RequestParam Integer level) {
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(mapToDto(verificationService.approveVerification(creatorId, level))));
    }

    @PutMapping("/{creatorId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<CreatorVerificationResponse>> rejectVerification(
            @PathVariable Long creatorId,
            @RequestBody String reason) {
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(mapToDto(verificationService.rejectVerification(creatorId, reason))));
    }
}

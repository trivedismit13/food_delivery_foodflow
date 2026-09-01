package com.foodflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.foodflow.dto.response.CreatorVerificationResponse;
import com.foodflow.model.CreatorVerification;

@RestController
@RequestMapping("/api/creators/{creatorId}/verification")
@RequiredArgsConstructor
public class VerificationController {
    private final com.foodflow.service.VerificationService verificationService;
    private final com.foodflow.service.security.CreatorAuthorizationService authorizationService;

    @GetMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<CreatorVerificationResponse>> getVerificationStatus(@PathVariable Long creatorId) {
        authorizationService.assertCreatorOwnsVerification(creatorId);
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(mapToResponse(verificationService.getVerificationStatus(creatorId))));
    }

    @PutMapping("/level-1")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<CreatorVerificationResponse>> submitLevel1(
            @PathVariable Long creatorId,
            @jakarta.validation.Valid @RequestBody com.foodflow.dto.request.VerificationRequest request) {
        authorizationService.assertCreatorOwnsVerification(creatorId);
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(mapToResponse(verificationService.submitLevel1(creatorId, request))));
    }

    @PutMapping("/level-2")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<CreatorVerificationResponse>> submitLevel2(
            @PathVariable Long creatorId,
            @jakarta.validation.Valid @RequestBody com.foodflow.dto.request.Level2VerificationRequest request) {
        authorizationService.assertCreatorOwnsVerification(creatorId);
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(mapToResponse(verificationService.submitLevel2(creatorId, request))));
    }

    private CreatorVerificationResponse mapToResponse(CreatorVerification v) {
        if (v == null) return null;
        return CreatorVerificationResponse.builder()
                .verificationId(v.getVerificationId())
                .currentLevel(v.getCurrentLevel())
                .levelUpdatedAt(v.getLevelUpdatedAt())
                .rejectionReason(v.getRejectionReason())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
    }
}

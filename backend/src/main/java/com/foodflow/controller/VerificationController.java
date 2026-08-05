package com.foodflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/creators/{creatorId}/verification")
@RequiredArgsConstructor
public class VerificationController {
    private final com.foodflow.service.VerificationService verificationService;

    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<com.foodflow.model.CreatorVerification>> getVerificationStatus(@PathVariable Long creatorId) {
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(verificationService.getVerificationStatus(creatorId)));
    }

    @PutMapping("/level-1")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<com.foodflow.model.CreatorVerification>> submitLevel1(
            @PathVariable Long creatorId,
            @jakarta.validation.Valid @RequestBody com.foodflow.dto.request.VerificationRequest request) {
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(verificationService.submitLevel1(creatorId, request)));
    }

    @PutMapping("/level-2")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<com.foodflow.model.CreatorVerification>> submitLevel2(
            @PathVariable Long creatorId,
            @jakarta.validation.Valid @RequestBody com.foodflow.dto.request.Level2VerificationRequest request) {
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(verificationService.submitLevel2(creatorId, request)));
    }

}

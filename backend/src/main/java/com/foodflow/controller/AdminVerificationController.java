package com.foodflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class AdminVerificationController {
    private final com.foodflow.service.VerificationService verificationService;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<java.util.List<com.foodflow.model.CreatorVerification>>> listPendingVerifications() {
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(verificationService.listPendingVerifications()));
    }

    @PutMapping("/{creatorId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<com.foodflow.model.CreatorVerification>> approveVerification(
            @PathVariable Long creatorId,
            @RequestParam Integer level) {
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(verificationService.approveVerification(creatorId, level)));
    }

    @PutMapping("/{creatorId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.foodflow.dto.response.ApiResponse<com.foodflow.model.CreatorVerification>> rejectVerification(
            @PathVariable Long creatorId,
            @RequestBody String reason) {
        return ResponseEntity.ok(com.foodflow.dto.response.ApiResponse.success(verificationService.rejectVerification(creatorId, reason)));
    }
}

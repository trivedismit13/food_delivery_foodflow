package com.foodflow.controller;

import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.NotificationResponse;
import com.foodflow.service.NotificationService;
import com.foodflow.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
            notificationService.getUserNotifications(userDetails.getId(), pageable)
        ));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Integer>> getUnreadCount(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        int count = notificationService.getUnreadCount(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        notificationService.markAllRead(userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        notificationService.markAsRead(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }
}

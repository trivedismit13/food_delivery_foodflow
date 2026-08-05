package com.foodflow.service;

import com.foodflow.model.Notification;
import com.foodflow.dto.response.NotificationResponse;
import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.Page;
import java.util.List;

public interface NotificationService {
    void sendNotification(Long userId, Notification.NotificationType type, 
                         String title, String message,
                         Notification.ReferenceType refType, Long refId);
    
    void notifyFollowers(Long creatorId, Notification.NotificationType type, 
                        String title, String message,
                        Notification.ReferenceType refType, Long refId);
    
    void notifyDropCustomers(Long dropId, Notification.NotificationType type,
                            String title, String message);
    
    Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);
    
    int getUnreadCount(Long userId);
    
    void markAllRead(Long userId);
    void markAsRead(Long notificationId, Long userId);
}

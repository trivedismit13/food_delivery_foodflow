package com.foodflow.service.impl;

import com.foodflow.model.Notification;
import com.foodflow.repository.CreatorFollowRepository;
import com.foodflow.repository.NotificationRepository;
import com.foodflow.repository.OrderRepository;
import com.foodflow.repository.UserRepository;
import com.foodflow.service.NotificationService;
import com.foodflow.dto.response.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Duration;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final CreatorFollowRepository creatorFollowRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public void sendNotification(Long userId, Notification.NotificationType type, 
                                 String title, String message, 
                                 Notification.ReferenceType refType, Long refId) {
        
        String eventKey = type.name() + ":" + userId + ":" + (refId != null ? refId : java.time.LocalDate.now().toString());

        Notification notification = Notification.builder()
                .user(userRepository.getReferenceById(userId))
                .type(type)
                .title(title)
                .message(message)
                .referenceType(refType)
                .referenceId(refId)
                .eventKey(eventKey)
                .isRead(false)
                .build();
        
        try {
            notification = notificationRepository.save(notification);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Idempotency: Ignore duplicate notifications
            return;
        }
        
        NotificationResponse response = NotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .type(notification.getType().name())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceType(notification.getReferenceType() != null ? notification.getReferenceType().name() : null)
                .referenceId(notification.getReferenceId())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt() != null ? notification.getCreatedAt() : LocalDateTime.now())
                .timeAgo("Just now")
                .build();
    }

    @Override
    public void notifyFollowers(Long creatorId, Notification.NotificationType type, 
                                String title, String message,
                                Notification.ReferenceType refType, Long refId) {
        List<Long> followerIds = creatorFollowRepository.findFollowerIdsByCreatorId(creatorId);
        for (Long followerId : followerIds) {
            sendNotification(followerId, type, title, message, refType, refId);
        }
    }

    @Override
    public void notifyDropCustomers(Long dropId, Notification.NotificationType type, 
                                    String title, String message) {
        Set<Long> customerIds = orderRepository.findUserIdsByDropId(dropId);
        for (Long customerId : customerIds) {
            sendNotification(customerId, type, title, message, Notification.ReferenceType.DROP, dropId);
        }
    }

    @Override
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId, pageable);
        return notifications.map(notification -> NotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .type(notification.getType().name())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceType(notification.getReferenceType() != null ? notification.getReferenceType().name() : null)
                .referenceId(notification.getReferenceId())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt() != null ? notification.getCreatedAt() : LocalDateTime.now())
                .timeAgo("Recently")
                .build());
    }

    @Override
    public int getUnreadCount(Long userId) {
        return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadForUser(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}

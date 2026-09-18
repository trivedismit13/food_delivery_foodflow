package com.foodflow.service;

import com.foodflow.model.Notification;
import com.foodflow.model.User;
import com.foodflow.repository.NotificationRepository;
import com.foodflow.repository.OrderRepository;
import com.foodflow.repository.UserRepository;
import com.foodflow.repository.CreatorFollowRepository;
import com.foodflow.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CreatorFollowRepository creatorFollowRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    @Test
    void testDuplicateProtection() {
        User user = new User();
        user.setUserId(1L);
        when(userRepository.getReferenceById(1L)).thenReturn(user);
        
        when(notificationRepository.save(any(Notification.class)))
            .thenAnswer(invocation -> invocation.getArgument(0))
            .thenThrow(new DataIntegrityViolationException("Duplicate"));
        
        // First call succeeds
        notificationService.sendNotification(1L, Notification.NotificationType.ORDER_READY, "Title", "Message", Notification.ReferenceType.ORDER, 10L);
        
        // Second call throws DataIntegrityViolationException which should be caught and ignored
        notificationService.sendNotification(1L, Notification.NotificationType.ORDER_READY, "Title", "Message", Notification.ReferenceType.ORDER, 10L);
        
        verify(notificationRepository, times(2)).save(any(Notification.class));
    }
}

package com.foodflow.websocket;

import com.foodflow.dto.response.DropUpdateMessage;
import com.foodflow.dto.response.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DropWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastDropUpdate(Long dropId, int currentOrders, int maxOrders) {
        DropUpdateMessage message = DropUpdateMessage.builder()
            .dropId(dropId)
            .currentOrders(currentOrders)
            .maxOrders(maxOrders)
            .availableSlots(maxOrders - currentOrders)
            .isSoldOut(currentOrders >= maxOrders)
            .timestamp(LocalDateTime.now())
            .build();
        
        messagingTemplate.convertAndSend(
            "/topic/drops/" + dropId, 
            message
        );
    }

    public void sendUserNotification(Long userId, NotificationResponse notification) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            notification
        );
    }
}

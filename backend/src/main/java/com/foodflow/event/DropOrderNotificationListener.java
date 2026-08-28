package com.foodflow.event;

import com.foodflow.model.Notification;
import com.foodflow.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class DropOrderNotificationListener {

    private final NotificationService notificationService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDropOrderConfirmed(DropOrderConfirmedEvent event) {
        // Send notification
        notificationService.sendNotification(
            event.getUserId(),
            Notification.NotificationType.ORDER_CONFIRMED,
            "Order Confirmed!",
            "Your pre-order for " + event.getDropTitle() + " is confirmed. " +
            "Collection: " + event.getPickupTime(),
            Notification.ReferenceType.ORDER,
            event.getOrderId()
        );

        // Broadcast websocket update removed for MVP
    }
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onNewFollower(NewFollowerEvent event) {
        notificationService.sendNotification(
            event.getCreatorId(),
            Notification.NotificationType.NEW_FOLLOWER,
            "New Follower!",
            event.getFollowerName() + " is now following you.",
            Notification.ReferenceType.USER,
            event.getFollowerId()
        );
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onLowStock(LowStockEvent event) {
        notificationService.sendNotification(
            event.getCreatorId(),
            Notification.NotificationType.LOW_STOCK,
            "Low Stock Alert!",
            "Only " + event.getRemaining() + " portions left of " + event.getItemName() + " for " + event.getDropTitle(),
            Notification.ReferenceType.DROP,
            event.getDropId()
        );
    }
}

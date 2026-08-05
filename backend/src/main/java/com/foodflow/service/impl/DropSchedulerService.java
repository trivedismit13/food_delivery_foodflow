package com.foodflow.service.impl;

import com.foodflow.model.FoodDrop;
import com.foodflow.model.Notification;
import com.foodflow.model.Restaurant;
import com.foodflow.repository.CreatorFollowRepository;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.repository.OrderRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DropSchedulerService {

    private final FoodDropRepository dropRepository;
    private final NotificationService notificationService;
    private final CreatorFollowRepository creatorFollowRepository;
    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;

    // Runs every 15 minutes
    @Scheduled(fixedRate = 900000)
    @Transactional
    public void processDropStatusTransitions() {
        
        List<FoodDrop> pastCutoff = dropRepository.findDropsPastCutoff();
        pastCutoff.forEach(drop -> {
            drop.setStatus(FoodDrop.DropStatus.CUTOFF);
            dropRepository.save(drop);
            
            notificationService.sendNotification(
                drop.getCreator().getOwner().getUserId(),
                Notification.NotificationType.ORDER_CONFIRMED,
                "Drop Order Window Closed",
                drop.getTitle() + " closed with " + drop.getCurrentOrders() + 
                "/" + drop.getMaxOrders() + " orders. Time to start cooking!",
                Notification.ReferenceType.DROP,
                drop.getDropId()
            );
        });
    }

    // Runs every hour
    @Scheduled(fixedRate = 3600000)
    public void sendClosingSoonAlerts() {
        
        List<FoodDrop> closingSoon = dropRepository.findDropsClosingSoon(2);
        
        closingSoon.forEach(drop -> {
            List<Long> followerIds = creatorFollowRepository
                .findFollowerIdsByCreatorId(drop.getCreator().getRestaurantId());
            
            Set<Long> customersWhoOrdered = orderRepository
                .findUserIdsByDropId(drop.getDropId());
            
            followerIds.stream()
                .filter(id -> !customersWhoOrdered.contains(id))
                .forEach(followerId -> {
                    int slotsLeft = drop.availableSlots();
                    notificationService.sendNotification(
                        followerId,
                        Notification.NotificationType.DROP_CLOSING_SOON,
                        "⏰ Closing Soon!",
                        drop.getTitle() + " closes in 2 hours. " + 
                        slotsLeft + " slots remaining.",
                        Notification.ReferenceType.DROP,
                        drop.getDropId()
                    );
                });
        });
    }

    @Scheduled(cron = "0 0 7 * * *")
    public void sendMorningCreatorDigest() {
        
        List<Restaurant> activeCreators = restaurantRepository
            .findByIsAcceptingOrdersTrue();
        
        activeCreators.forEach(creator -> {
            notificationService.sendNotification(
                creator.getOwner().getUserId(),
                Notification.NotificationType.CREATOR_DIGEST,
                "Good Morning, Chef!",
                "Here is your morning digest. Check your dashboard for today's drop updates and new orders!",
                Notification.ReferenceType.NONE,
                null
            );
        });
    }
}

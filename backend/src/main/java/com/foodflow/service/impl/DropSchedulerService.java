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
    private final com.foodflow.service.DropService dropService;

    // Runs every 15 minutes
    @Scheduled(cron = "0 0/15 * * * ?")
    @Transactional
    public void processDropStatusTransitions() {
        
        List<FoodDrop> pastCutoff = dropRepository.findDropsPastCutoff();
        pastCutoff.forEach(drop -> {
            dropService.updateDropStatus(drop.getDropId(), FoodDrop.DropStatus.CUTOFF);
            
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
    @Scheduled(cron = "0 0 * * * ?")
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

    @Scheduled(cron = "0 0 7 * * ?")
    @Transactional
    public void sendMorningCreatorDigest() {
        
        List<Restaurant> activeCreators = restaurantRepository
            .findByIsAcceptingOrdersTrue();
        
        activeCreators.forEach(creator -> {
            List<FoodDrop> todayDrops = dropRepository.findByCreatorRestaurantIdAndStatusIn(
                creator.getRestaurantId(),
                List.of(FoodDrop.DropStatus.OPEN, FoodDrop.DropStatus.ANNOUNCED, FoodDrop.DropStatus.CUTOFF, FoodDrop.DropStatus.READY),
                org.springframework.data.domain.Pageable.unpaged()
            ).stream().filter(d -> d.getDropDate() != null && d.getDropDate().equals(java.time.LocalDate.now())).toList();
            
            int totalOrders = todayDrops.stream().mapToInt(FoodDrop::getCurrentOrders).sum();
            java.math.BigDecimal revenue = java.math.BigDecimal.ZERO;
            
            for (FoodDrop d : todayDrops) {
                List<com.foodflow.model.Order> orders = orderRepository.findByDropDropIdAndStatusNot(d.getDropId(), com.foodflow.model.OrderStatus.CANCELLED);
                for (com.foodflow.model.Order o : orders) {
                    if (o.getTotalAmount() != null) {
                        revenue = revenue.add(o.getTotalAmount());
                    }
                }
            }
            
            String message;
            if (todayDrops.isEmpty()) {
                message = "You have 0 drops scheduled for today. Create one to get started!";
            } else {
                message = String.format("You have %d drop(s) today. Orders received: %d. Estimated Revenue: $%.2f.", todayDrops.size(), totalOrders, revenue);
            }
            
            notificationService.sendNotification(
                creator.getOwner().getUserId(),
                Notification.NotificationType.CREATOR_DIGEST,
                "Good Morning, Chef!",
                message,
                Notification.ReferenceType.NONE,
                null
            );
        });
    }
}

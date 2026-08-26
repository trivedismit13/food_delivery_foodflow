package com.foodflow.service.impl;

import com.foodflow.model.CreatorVerification;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.model.Role;
import com.foodflow.model.Notification.NotificationType;
import com.foodflow.model.Notification.ReferenceType;
import com.foodflow.dto.request.VerificationRequest;
import com.foodflow.dto.request.Level2VerificationRequest;
import com.foodflow.repository.CreatorVerificationRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.UserRepository;
import com.foodflow.service.VerificationService;
import com.foodflow.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {

    private final CreatorVerificationRepository verificationRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public CreatorVerification getVerificationStatus(Long creatorId) {
        return verificationRepository.findByCreatorRestaurantId(creatorId)
                .orElseGet(() -> createInitialVerification(creatorId));
    }

    private CreatorVerification createInitialVerification(Long creatorId) {
        Restaurant restaurant = restaurantRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));
        
        CreatorVerification verification = CreatorVerification.builder()
                .creator(restaurant)
                .currentLevel(0)
                .build();
        return verificationRepository.save(verification);
    }

    @Override
    public CreatorVerification submitLevel1(Long creatorId, VerificationRequest request) {
        CreatorVerification verification = getVerificationStatus(creatorId);
        
        verification.setFoodLicenceUrl(request.getDocumentUrl());
        verification.setRejectionReason(null);
        
        return verificationRepository.save(verification);
    }

    @Override
    public CreatorVerification submitLevel2(Long creatorId, Level2VerificationRequest request) {
        CreatorVerification verification = getVerificationStatus(creatorId);
        
        verification.setFoodLicenceNumber(request.getFoodLicenceNumber());
        verification.setFoodLicenceUrl(request.getFoodLicenceUrl());
        verification.setKitchenPhotoUrl1(request.getKitchenPhotoUrl1());
        verification.setKitchenPhotoUrl2(request.getKitchenPhotoUrl2());
        verification.setRejectionReason(null);
        
        CreatorVerification saved = verificationRepository.save(verification);
        
        // Notify all admins
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            notificationService.sendNotification(
                admin.getUserId(),
                NotificationType.ORDER_CONFIRMED, // Reusing per instructions
                "Verification request",
                verification.getCreator().getName() + " submitted Level 2 verification",
                ReferenceType.USER, 
                creatorId
            );
        }
        
        return saved;
    }

    @Override
    public List<CreatorVerification> listPendingVerifications() {
        return verificationRepository.findByCurrentLevelLessThan(2);
    }

    @Override
    public CreatorVerification approveVerification(Long creatorId, Integer level) {
        CreatorVerification verification = getVerificationStatus(creatorId);
        
        verification.setCurrentLevel(level);
        verification.setLevelUpdatedAt(LocalDateTime.now());
        
        Restaurant restaurant = verification.getCreator();
        restaurant.setVerificationLevel(level);
        restaurantRepository.save(restaurant);
        
        CreatorVerification saved = verificationRepository.save(verification);
        
        // Notify creator
        notificationService.sendNotification(
            restaurant.getOwner().getUserId(),
            NotificationType.ORDER_CONFIRMED, // Reusing per instructions
            "Verification Approved! ✅",
            "Your Level " + level + " verification is approved. Your profile now shows Food Licensed badge.",
            ReferenceType.USER,
            creatorId
        );
        
        return saved;
    }

    @Override
    public CreatorVerification rejectVerification(Long creatorId, String reason) {
        CreatorVerification verification = getVerificationStatus(creatorId);
        
        verification.setRejectionReason(reason);
        
        return verificationRepository.save(verification);
    }
}

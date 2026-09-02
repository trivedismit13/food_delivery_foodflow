package com.foodflow.service;

import com.foodflow.dto.request.ReelRequest;
import com.foodflow.exception.InvalidRequestException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.dto.response.ReelResponse;
import com.foodflow.model.Reel;
import io.micrometer.core.instrument.MeterRegistry;
import com.foodflow.model.Restaurant;
import com.foodflow.model.Role;
import com.foodflow.model.User;
import com.foodflow.repository.ReelRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReelServiceImpl implements ReelService {

    private final ReelRepository reelRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final MeterRegistry meterRegistry;

    @Override
    public ReelResponse uploadReel(Long restaurantId, ReelRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (user.getRole() != Role.SELLER) {
            throw new InvalidRequestException("Only sellers can upload reels.");
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
                
        if (!restaurant.getOwner().getUserId().equals(user.getUserId())) {
            throw new InvalidRequestException("You do not own this restaurant profile.");
        }
        
        Reel reel = new Reel();
        reel.setRestaurant(restaurant);
        reel.setTitle(request.getTitle());
        reel.setMediaUrl(request.getMediaUrl());
        reel = reelRepository.save(reel);
        if (org.springframework.transaction.support.TransactionSynchronizationManager.isSynchronizationActive()) {
            org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(
                new org.springframework.transaction.support.TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        meterRegistry.counter("foodflow.reels.created").increment();
                    }
                }
            );
        } else {
            meterRegistry.counter("foodflow.reels.created").increment();
        }
        return mapToResponse(reel);
    }

    @Override
    public Page<ReelResponse> getRestaurantReels(Long restaurantId, Pageable pageable) {
        return reelRepository.findByRestaurantRestaurantIdOrderByCreatedAtDesc(restaurantId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<ReelResponse> getDiscoveryFeed(Pageable pageable) {
        return reelRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    private ReelResponse mapToResponse(Reel reel) {
        return ReelResponse.builder()
                .reelId(reel.getReelId())
                .title(reel.getTitle())
                .mediaUrl(reel.getMediaUrl())
                .createdAt(reel.getCreatedAt())
                .restaurantId(reel.getRestaurant().getRestaurantId())
                .restaurantName(reel.getRestaurant().getName())
                .build();
    }
}

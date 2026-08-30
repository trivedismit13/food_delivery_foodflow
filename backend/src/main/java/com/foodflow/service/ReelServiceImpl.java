package com.foodflow.service;

import com.foodflow.dto.request.ReelRequest;
import com.foodflow.exception.InvalidRequestException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.Reel;
import com.foodflow.model.Restaurant;
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

    @Override
    public Reel uploadReel(Long restaurantId, ReelRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
                
        if (!restaurant.getOwner().getUserId().equals(user.getUserId())) {
            throw new InvalidRequestException("You do not own this restaurant profile.");
        }
        
        Reel reel = new Reel();
        reel.setRestaurant(restaurant);
        reel.setTitle(request.getTitle());
        reel.setMediaUrl(request.getMediaUrl());
        return reelRepository.save(reel);
    }

    @Override
    public Page<Reel> getRestaurantReels(Long restaurantId, Pageable pageable) {
        return reelRepository.findByRestaurantRestaurantIdOrderByCreatedAtDesc(restaurantId, pageable);
    }

    @Override
    public Page<Reel> getDiscoveryFeed(Pageable pageable) {
        return reelRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}

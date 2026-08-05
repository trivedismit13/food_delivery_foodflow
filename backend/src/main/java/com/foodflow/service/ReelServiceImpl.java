package com.foodflow.service;

import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.Reel;
import com.foodflow.repository.ReelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReelServiceImpl implements ReelService {

    private final ReelRepository reelRepository;

    @Override
    public Reel uploadReel(Reel reel) {
        return reelRepository.save(reel);
    }

    @Override
    public Page<Reel> getRestaurantReels(Long restaurantId, Pageable pageable) {
        return reelRepository.findByRestaurantRestaurantId(restaurantId, pageable);
    }

    @Override
    public Page<Reel> getDiscoveryFeed(Pageable pageable) {
        return reelRepository.findAll(pageable); // In real app, sort by view_count DESC is done via Pageable
    }

    @Override
    public void incrementViewCount(Long reelId) {
        Reel reel = reelRepository.findById(reelId)
                .orElseThrow(() -> new ResourceNotFoundException("Reel not found"));
        reel.setViewCount(reel.getViewCount() + 1);
        reelRepository.save(reel);
    }
}

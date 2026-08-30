package com.foodflow.repository;

import com.foodflow.model.Reel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReelRepository extends JpaRepository<Reel, Long> {
    Page<Reel> findByRestaurantRestaurantIdOrderByCreatedAtDesc(Long restaurantId, Pageable pageable);
    Page<Reel> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

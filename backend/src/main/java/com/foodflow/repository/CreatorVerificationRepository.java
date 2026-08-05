package com.foodflow.repository;

import com.foodflow.model.CreatorVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreatorVerificationRepository extends JpaRepository<CreatorVerification, Long> {
    Optional<CreatorVerification> findByCreatorRestaurantId(Long creatorId);
    List<CreatorVerification> findByCurrentLevelLessThan(Integer level);
}

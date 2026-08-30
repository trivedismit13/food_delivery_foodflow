package com.foodflow.repository;

import com.foodflow.model.DropItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DropItemRepository extends JpaRepository<DropItem, Long> {

    List<DropItem> findByDropDropId(Long dropId);

    // Find specific item in a drop with pessimistic lock
    // Used during order placement to prevent oversell
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT di FROM DropItem di WHERE di.drop.dropId = :dropId AND di.menuItem.itemId = :itemId")
    Optional<DropItem> findByDropAndItemWithLock(
        @Param("dropId") Long dropId, 
        @Param("itemId") Long itemId);
    // WHY PESSIMISTIC_WRITE:
    // During order placement we read and then update quantityOrdered
    // Read-then-write must be atomic for inventory correctness
    // PESSIMISTIC_WRITE holds a DB-level lock on the row
    // until the transaction commits
}

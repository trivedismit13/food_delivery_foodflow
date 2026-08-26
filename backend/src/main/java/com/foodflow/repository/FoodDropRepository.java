package com.foodflow.repository;

import com.foodflow.model.FoodDrop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FoodDropRepository extends JpaRepository<FoodDrop, Long>, JpaSpecificationExecutor<FoodDrop> {

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM FoodDrop d WHERE d.dropId = :id")
    java.util.Optional<FoodDrop> findByIdWithLock(@Param("id") Long id);

    // All active drops for a creator
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"creator", "dropItems"})
    @Query("SELECT d FROM FoodDrop d WHERE d.creator.owner.userId = :ownerUserId AND d.status IN :statuses")
    org.springframework.data.domain.Page<FoodDrop> findByCreatorOwnerUserIdAndStatusIn(
        @Param("ownerUserId") Long ownerUserId, @Param("statuses") List<FoodDrop.DropStatus> statuses, org.springframework.data.domain.Pageable pageable);

    // Find by restaurant ID
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"creator", "dropItems"})
    org.springframework.data.domain.Page<FoodDrop> findByCreatorRestaurantIdAndStatusIn(
        Long creatorId, List<FoodDrop.DropStatus> statuses, org.springframework.data.domain.Pageable pageable);

    // Discovery feed: all open drops, ordered by cutoff time ascending
    // Shows most urgent (closing soonest) first
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"creator", "dropItems"})
    @Query("""
        SELECT d FROM FoodDrop d 
        WHERE d.status = 'OPEN' 
        AND d.orderCutoffTime > :now
        ORDER BY d.orderCutoffTime ASC
        """)
    org.springframework.data.domain.Page<FoodDrop> findActiveDropsOrderByCutoff(@Param("now") LocalDateTime now, org.springframework.data.domain.Pageable pageable);

    // Drops from creators a user follows
    // This is the personalized feed
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"creator", "dropItems"})
    @Query("""
        SELECT fd FROM FoodDrop fd
        JOIN CreatorFollow cf ON fd.creator = cf.creator
        WHERE cf.follower.userId = :userId
        AND fd.status IN ('ANNOUNCED', 'OPEN')
        AND fd.orderCutoffTime > CURRENT_TIMESTAMP
        ORDER BY fd.orderCutoffTime ASC
        """)
    org.springframework.data.domain.Page<FoodDrop> findDropsFromFollowedCreators(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);

    // Drops closing in the next N hours (for CLOSING_SOON notifications)
    @Query(value = """
        SELECT * FROM food_drops
        WHERE status = 'OPEN'
        AND order_cutoff_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL :hours HOUR)
        """, nativeQuery = true)
    List<FoodDrop> findDropsClosingSoon(@Param("hours") int hours);

    // Drops that passed cutoff but are still OPEN (need status update)
    @Query(value = """
        SELECT * FROM food_drops
        WHERE status = 'OPEN'
        AND order_cutoff_time <= NOW()
        """, nativeQuery = true)
    List<FoodDrop> findDropsPastCutoff();

    @Query(value = """
        SELECT * FROM food_drops
        WHERE creator_id = :creatorId
        ORDER BY drop_date DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<FoodDrop> findRecentDrops(@Param("creatorId") Long creatorId, @Param("limit") int limit);

    @Query(value = """
        SELECT fd.* FROM food_drops fd
        JOIN restaurants r ON fd.creator_id = r.restaurant_id
        WHERE fd.status = 'OPEN' 
        AND fd.order_cutoff_time > NOW()
        AND (:type IS NULL OR r.creator_type = :type)
        AND (:dateStr IS NULL OR DATE(fd.drop_date) = :dateStr)
        AND (:searchQuery IS NULL OR LOWER(fd.title) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR LOWER(fd.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR LOWER(r.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')))
        ORDER BY fd.order_cutoff_time ASC
        """, 
        countQuery = """
        SELECT count(*) FROM food_drops fd
        JOIN restaurants r ON fd.creator_id = r.restaurant_id
        WHERE fd.status = 'OPEN' 
        AND fd.order_cutoff_time > NOW()
        AND (:type IS NULL OR r.creator_type = :type)
        AND (:dateStr IS NULL OR DATE(fd.drop_date) = :dateStr)
        AND (:searchQuery IS NULL OR LOWER(fd.title) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR LOWER(fd.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR LOWER(r.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')))
        """,
        nativeQuery = true)
    org.springframework.data.domain.Page<FoodDrop> findActiveDrops(
        @Param("type") String type, 
        @Param("dateStr") String dateStr, 
        @Param("searchQuery") String searchQuery, 
        org.springframework.data.domain.Pageable pageable
    );
}

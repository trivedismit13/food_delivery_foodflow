package com.foodflow.repository;

import com.foodflow.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // All unread notifications for a user
    List<Notification> findByUserUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    // All notifications paginated
    Page<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    int countByUserUserIdAndIsReadFalse(Long userId);
    // Used for the notification badge count

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.userId = :userId")
    void markAllReadForUser(@Param("userId") Long userId);
}

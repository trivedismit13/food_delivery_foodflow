package com.foodflow.repository;

import com.foodflow.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserUserId(Long userId, Pageable pageable);
    Page<Order> findByRestaurantRestaurantId(Long restaurantId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT o.user.userId FROM Order o WHERE o.drop.dropId = :dropId")
    java.util.Set<Long> findUserIdsByDropId(@org.springframework.data.repository.query.Param("dropId") Long dropId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "restaurant"})
    java.util.Optional<Order> findById(Long id);

    java.util.List<Order> findByDropDropIdAndStatusNot(Long dropId, com.foodflow.model.OrderStatus status);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user"})
    java.util.List<Order> findByDropDropId(Long dropId);

    boolean existsByUserUserIdAndRestaurantRestaurantIdAndStatus(Long userId, Long restaurantId, com.foodflow.model.OrderStatus status);
}

package com.foodflow.repository;

import com.foodflow.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"menuItem"})
    List<OrderItem> findByOrderOrderId(Long orderId);
}

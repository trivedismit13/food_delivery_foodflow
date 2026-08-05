package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Version
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drop_id")
    private FoodDrop drop;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type")
    @Builder.Default
    private OrderType orderType = OrderType.REGULAR;

    private LocalDateTime pickupTime;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Builder.Default
    private Boolean isDelivery = false;

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    @Column(name = "order_date", insertable = false, updatable = false)
    private LocalDateTime orderDate;

    public enum OrderType {
        REGULAR, DROP_PREORDER
    }
}

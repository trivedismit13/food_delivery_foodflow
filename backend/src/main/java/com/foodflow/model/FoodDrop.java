package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "food_drops")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodDrop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dropId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Restaurant creator;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate dropDate;

    @Column(nullable = false)
    private LocalDateTime orderCutoffTime;

    private LocalDateTime pickupStartTime;
    private LocalDateTime pickupEndTime;

    @Column(nullable = false)
    private Integer maxOrders;

    @Column(nullable = false)
    @Builder.Default
    private Integer currentOrders = 0;
    
    @Version
    private Long version;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DropStatus status = DropStatus.DRAFT;

    @Builder.Default
    private Boolean isDeliveryAvailable = false;
    
    @Builder.Default
    private BigDecimal deliveryCharge = BigDecimal.ZERO;

    private String dropPhotoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String specialNotes;

    @OneToMany(mappedBy = "drop", cascade = CascadeType.ALL)
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private List<DropItem> dropItems = new ArrayList<>();

    @OneToMany(mappedBy = "drop")
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "drop")
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private List<Reel> reels = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public boolean isAcceptingOrders() {
        return status == DropStatus.OPEN 
            && LocalDateTime.now().isBefore(orderCutoffTime)
            && currentOrders < maxOrders;
    }

    public boolean isSoldOut() {
        return currentOrders >= maxOrders;
    }

    public int availableSlots() {
        return Math.max(0, maxOrders - currentOrders);
    }

    public enum DropStatus {
        DRAFT, ANNOUNCED, OPEN, CUTOFF, READY, COMPLETED, CANCELLED
    }
}

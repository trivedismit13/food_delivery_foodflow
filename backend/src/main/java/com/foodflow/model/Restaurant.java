package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Where(clause = "is_open = true")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_id")
    private Long restaurantId;

    @Version
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 200)
    private String city;

    @Column(length = 20)
    private String pincode;

    @Column(nullable = false, length = 50)
    private String cuisine;

    @Column(name = "is_open", nullable = false)
    @Builder.Default
    private Boolean isOpen = true;

    @Column(name = "creator_type")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CreatorType creatorType = CreatorType.HOME_BAKER;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "instagram_handle")
    private String instagramHandle;

    @Column(name = "pickup_address", columnDefinition = "TEXT")
    private String pickupAddress;

    @Column(name = "verification_level", columnDefinition = "TINYINT")
    @Builder.Default
    private Integer verificationLevel = 0;

    @Column(name = "total_orders_completed")
    @Builder.Default
    private Integer totalOrdersCompleted = 0;

    @Column(name = "follower_count")
    @Builder.Default
    private Integer followerCount = 0;

    @Column(name = "avg_rating")
    @Builder.Default
    private java.math.BigDecimal avgRating = java.math.BigDecimal.ZERO;

    @Column(name = "is_accepting_orders")
    @Builder.Default
    private Boolean isAcceptingOrders = true;

    @Column(name = "announcement", columnDefinition = "TEXT")
    private String announcement;

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL)
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private java.util.List<FoodDrop> drops = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL)
    @Builder.Default
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private java.util.List<CreatorFollow> followers = new java.util.ArrayList<>();

    @OneToOne(mappedBy = "creator", cascade = CascadeType.ALL)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private CreatorVerification verification;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum CreatorType {
        HOME_BAKER,
        TIFFIN_SERVICE,
        CAMPUS_SELLER,
        WEEKEND_CHEF,
        CLOUD_KITCHEN,
        SPECIALTY_DESSERTS,
        HEALTHY_MEALS
    }
}

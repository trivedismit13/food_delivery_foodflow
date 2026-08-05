package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "reels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reel_id")
    private Long reelId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "media_url", nullable = false, length = 255)
    private String mediaUrl;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drop_id")
    private FoodDrop drop;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}

package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "restaurant_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @jakarta.validation.constraints.DecimalMin("1.0")
    @jakarta.validation.constraints.DecimalMax("5.0")
    @Column(name = "rating_value", nullable = false, precision = 2, scale = 1)
    private BigDecimal ratingValue;

    @Column(name = "food_quality_rating", precision = 2, scale = 1)
    private BigDecimal foodQualityRating;


    @Column(name = "packaging_rating", precision = 2, scale = 1)
    private BigDecimal packagingRating;

    @Column(name = "review_text", columnDefinition = "TEXT")
    private String reviewText;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}

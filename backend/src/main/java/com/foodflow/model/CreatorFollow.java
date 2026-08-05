package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "creator_follows",
    uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "creator_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorFollow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long followId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private Restaurant creator;

    @CreationTimestamp
    private LocalDateTime followedAt;
}

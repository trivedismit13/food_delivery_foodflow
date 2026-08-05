package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "creator_verifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long verificationId;

    @OneToOne
    @JoinColumn(name = "creator_id", unique = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Restaurant creator;

    @Builder.Default
    private Boolean aadhaarVerified = false;
    
    @Builder.Default
    private Boolean phoneVerified = false;

    private String foodLicenceNumber;
    private String foodLicenceUrl;
    @Column(name = "kitchen_photo_url_1")
    private String kitchenPhotoUrl1;
    
    @Column(name = "kitchen_photo_url_2")
    private String kitchenPhotoUrl2;

    @Column(columnDefinition = "TEXT")
    private String ingredientDeclaration;

    @Builder.Default
    private Boolean inspectionPassed = false;
    
    private LocalDate inspectionDate;

    @Column(columnDefinition = "TEXT")
    private String inspectionNotes;

    @ManyToOne
    @JoinColumn(name = "inspected_by")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private User inspectedBy;

    @Builder.Default
    @Column(columnDefinition = "TINYINT")
    private Integer currentLevel = 0;
    
    private LocalDateTime levelUpdatedAt;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

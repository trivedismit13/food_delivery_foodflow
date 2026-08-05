package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Table(name = "cities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id")
    private Long cityId;

    @Column(name = "city_name", nullable = false, length = 200)
    private String cityName;

    @Column(length = 200)
    private String district;

    @Column(nullable = false, length = 200)
    private String state;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String country = "India";

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private Long population;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}

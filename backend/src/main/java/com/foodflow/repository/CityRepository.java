package com.foodflow.repository;

import com.foodflow.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    
    List<City> findByCityNameStartingWithIgnoreCaseAndIsActiveTrueOrderByPopulationDesc(String cityName);

    @Query(value = "SELECT * FROM cities " +
                   "WHERE is_active = true " +
                   "ORDER BY (6371 * ACOS(COS(RADIANS(:lat)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(:lng)) + SIN(RADIANS(:lat)) * SIN(RADIANS(latitude)))) ASC LIMIT 1", nativeQuery = true)
    Optional<City> findNearestCity(@Param("lat") Double lat, @Param("lng") Double lng);
}

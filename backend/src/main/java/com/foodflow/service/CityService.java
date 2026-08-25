package com.foodflow.service;

import com.foodflow.model.City;
import com.foodflow.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepository cityRepository;
    private final com.foodflow.service.location.GeocodingProvider geocodingProvider;

    public List<City> searchCities(String query, int limit) {
        List<City> cities = cityRepository.findByCityNameStartingWithIgnoreCaseAndIsActiveTrueOrderByPopulationDesc(query);
        if (cities.size() > limit) {
            return cities.subList(0, limit);
        }
        return cities;
    }

    public com.foodflow.dto.response.LocationResponse reverseGeocode(Double lat, Double lng) {
        return geocodingProvider.reverseGeocode(lat, lng);
    }
}

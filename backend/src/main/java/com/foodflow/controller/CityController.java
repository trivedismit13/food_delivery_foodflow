package com.foodflow.controller;

import com.foodflow.model.City;
import com.foodflow.service.CityService;
import com.foodflow.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping("/cities/search")
    public ResponseEntity<ApiResponse<List<City>>> searchCities(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {
        List<City> cities = cityService.searchCities(q, limit);
        return ResponseEntity.ok(ApiResponse.success(cities));
    }

    @GetMapping("/location/reverse-geocode")
    public ResponseEntity<ApiResponse<City>> reverseGeocode(
            @RequestParam Double lat,
            @RequestParam Double lng) {
        City city = cityService.reverseGeocode(lat, lng);
        if (city == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Location not found in service area", 400));
        }
        return ResponseEntity.ok(ApiResponse.success(city));
    }
}

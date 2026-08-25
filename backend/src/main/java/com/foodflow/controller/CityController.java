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

    @PostMapping("/location/reverse-geocode")
    public ResponseEntity<ApiResponse<com.foodflow.dto.response.LocationResponse>> reverseGeocode(
            @jakarta.validation.Valid @RequestBody com.foodflow.dto.request.LocationRequest request) {
        com.foodflow.dto.response.LocationResponse location = cityService.reverseGeocode(request.getLat(), request.getLng());
        if (location == null || location.getCityId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Location not found in service area", 400));
        }
        return ResponseEntity.ok(ApiResponse.success(location));
    }
}

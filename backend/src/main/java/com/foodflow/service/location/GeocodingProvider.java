package com.foodflow.service.location;

import com.foodflow.dto.response.LocationResponse;

public interface GeocodingProvider {
    LocationResponse reverseGeocode(Double lat, Double lng);
}

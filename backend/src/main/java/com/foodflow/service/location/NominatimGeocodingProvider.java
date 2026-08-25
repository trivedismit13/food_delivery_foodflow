package com.foodflow.service.location;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.foodflow.dto.response.LocationResponse;
import com.foodflow.model.City;
import com.foodflow.repository.CityRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class NominatimGeocodingProvider implements GeocodingProvider {

    private final CityRepository cityRepository;
    private final RestTemplate restTemplate;

    public NominatimGeocodingProvider(CityRepository cityRepository, org.springframework.boot.web.client.RestTemplateBuilder restTemplateBuilder) {
        this.cityRepository = cityRepository;
        this.restTemplate = restTemplateBuilder.build();
    }

    @Value("${geocoding.nominatim.url:https://nominatim.openstreetmap.org/reverse}")
    private String nominatimUrl;

    @Value("${geocoding.nominatim.user-agent:FoodFlow/1.0}")
    private String userAgent;

    // Manual Cache to prevent hitting Nominatim limits (1 req/sec)
    // Key format: lat_lng rounded to 3 decimals
    private final Map<String, LocationResponse> cache = new ConcurrentHashMap<>();

    @Override
    public LocationResponse reverseGeocode(Double lat, Double lng) {
        String cacheKey = String.format("%.3f,%.3f", lat, lng);
        if (cache.containsKey(cacheKey)) {
            log.info("LOCATION_RESOLUTION_CACHE_HIT: lat={}, lng={}", lat, lng);
            return cache.get(cacheKey);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", userAgent);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = UriComponentsBuilder.fromHttpUrl(nominatimUrl)
                    .queryParam("format", "jsonv2")
                    .queryParam("lat", lat)
                    .queryParam("lon", lng)
                    .toUriString();

            ResponseEntity<NominatimResponse> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    NominatimResponse.class
            );

            NominatimResponse response = responseEntity.getBody();

            if (response != null && response.getAddress() != null) {
                String locationName = extractLocationName(response.getAddress());
                if (locationName != null) {
                    Optional<City> cityOpt = cityRepository.findByCityNameIgnoreCaseAndIsActiveTrue(locationName);

                    LocationResponse locResp;
                    if (cityOpt.isPresent()) {
                        City city = cityOpt.get();
                        locResp = LocationResponse.builder()
                                .latitude(lat)
                                .longitude(lng)
                                .cityId(city.getCityId())
                                .cityName(city.getCityName())
                                .stateName(response.getAddress().getState())
                                .countryName(response.getAddress().getCountry())
                                .source("NOMINATIM_MATCHED")
                                .build();
                        log.info("LOCATION_RESOLUTION_SUCCESS: Matched city: {}", locationName);
                    } else {
                        locResp = LocationResponse.builder()
                                .latitude(lat)
                                .longitude(lng)
                                .cityName(locationName)
                                .stateName(response.getAddress().getState())
                                .countryName(response.getAddress().getCountry())
                                .source("NOMINATIM_UNSUPPORTED")
                                .build();
                        log.warn("LOCATION_RESOLUTION_UNSUPPORTED: City not found in DB: {}", locationName);
                    }
                    
                    cache.put(cacheKey, locResp);
                    return locResp;
                }
            }

            log.warn("LOCATION_RESOLUTION_FAILED: Could not extract location name from Nominatim");
        } catch (Exception e) {
            log.error("LOCATION_RESOLUTION_ERROR: Error calling Nominatim API", e);
        }

        return null; // Return null if failed or exception
    }

    private String extractLocationName(NominatimAddress address) {
        if (address.getCity() != null && !address.getCity().isEmpty()) return address.getCity();
        if (address.getTown() != null && !address.getTown().isEmpty()) return address.getTown();
        if (address.getVillage() != null && !address.getVillage().isEmpty()) return address.getVillage();
        if (address.getCounty() != null && !address.getCounty().isEmpty()) return address.getCounty();
        return null;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NominatimResponse {
        private NominatimAddress address;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NominatimAddress {
        private String city;
        private String town;
        private String village;
        private String county;
        private String state;
        private String country;
    }
}

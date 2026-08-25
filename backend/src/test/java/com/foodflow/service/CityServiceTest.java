package com.foodflow.service;

import com.foodflow.dto.response.LocationResponse;
import com.foodflow.repository.CityRepository;
import com.foodflow.service.location.GeocodingProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CityServiceTest {

    @Mock
    private CityRepository cityRepository;

    @Mock
    private GeocodingProvider geocodingProvider;

    @InjectMocks
    private CityService cityService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testReverseGeocode() {
        LocationResponse mockResponse = new LocationResponse();
        mockResponse.setCityId(1L);
        mockResponse.setCityName("TestCity");
        when(geocodingProvider.reverseGeocode(10.0, 20.0)).thenReturn(mockResponse);

        LocationResponse response = cityService.reverseGeocode(10.0, 20.0);
        assertEquals(1L, response.getCityId());
        assertEquals("TestCity", response.getCityName());
        verify(geocodingProvider, times(1)).reverseGeocode(10.0, 20.0);
    }
}

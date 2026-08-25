package com.foodflow.service.location;

import com.foodflow.dto.response.LocationResponse;
import com.foodflow.model.City;
import com.foodflow.repository.CityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class NominatimGeocodingProviderTest {

    @Mock
    private CityRepository cityRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private RestTemplateBuilder restTemplateBuilder;

    private NominatimGeocodingProvider provider;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(restTemplateBuilder.build()).thenReturn(restTemplate);
        provider = new NominatimGeocodingProvider(cityRepository, restTemplateBuilder);
        ReflectionTestUtils.setField(provider, "nominatimUrl", "http://fake-url");
        ReflectionTestUtils.setField(provider, "userAgent", "FakeAgent");
    }

    @Test
    void testReverseGeocode_Success() {
        NominatimGeocodingProvider.NominatimResponse mockResponse = new NominatimGeocodingProvider.NominatimResponse();
        NominatimGeocodingProvider.NominatimAddress mockAddress = new NominatimGeocodingProvider.NominatimAddress();
        mockAddress.setCity("FakeCity");
        mockResponse.setAddress(mockAddress);

        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(NominatimGeocodingProvider.NominatimResponse.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        City mockCity = new City();
        mockCity.setCityId(1L);
        mockCity.setCityName("FakeCity");
        when(cityRepository.findByCityNameIgnoreCaseAndIsActiveTrue("FakeCity")).thenReturn(Optional.of(mockCity));

        LocationResponse response = provider.reverseGeocode(10.0, 20.0);
        assertNotNull(response);
        assertEquals(1L, response.getCityId());
        assertEquals("FakeCity", response.getCityName());
        assertEquals("NOMINATIM_MATCHED", response.getSource());
    }

    @Test
    void testReverseGeocode_Unsupported() {
        NominatimGeocodingProvider.NominatimResponse mockResponse = new NominatimGeocodingProvider.NominatimResponse();
        NominatimGeocodingProvider.NominatimAddress mockAddress = new NominatimGeocodingProvider.NominatimAddress();
        mockAddress.setCity("UnknownCity");
        mockResponse.setAddress(mockAddress);

        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(NominatimGeocodingProvider.NominatimResponse.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        when(cityRepository.findByCityNameIgnoreCaseAndIsActiveTrue("UnknownCity")).thenReturn(Optional.empty());

        LocationResponse response = provider.reverseGeocode(30.0, 40.0); // Use different lat/lng to avoid cache hit
        assertNotNull(response);
        assertNull(response.getCityId());
        assertEquals("UnknownCity", response.getCityName());
        assertEquals("NOMINATIM_UNSUPPORTED", response.getSource());
    }
}

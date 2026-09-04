package com.foodflow.config;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CorsConfigTest {

    @Test
    void testCorsConfigTrimsWhitespaceAndIgnoresBlanks() {
        CorsConfig config = new CorsConfig();
        
        // Simulate properties: " http://localhost:3000 , http://example.com , , "
        ReflectionTestUtils.setField(config, "allowedOrigins", " http://localhost:3000 , http://example.com , , ");
        
        CorsConfigurationSource source = config.corsConfigurationSource();
        assertTrue(source instanceof UrlBasedCorsConfigurationSource);
        
        CorsConfiguration corsConfig = ((UrlBasedCorsConfigurationSource) source).getCorsConfiguration(new org.springframework.mock.web.MockHttpServletRequest("GET", "/api/test"));
        
        assertNotNull(corsConfig);
        List<String> origins = corsConfig.getAllowedOrigins();
        assertNotNull(origins);
        
        assertEquals(2, origins.size());
        assertTrue(origins.contains("http://localhost:3000"));
        assertTrue(origins.contains("http://example.com"));
    }

    @Test
    void testCorsConfigFallback() {
        CorsConfig config = new CorsConfig();
        
        // If properties is not supplied, it defaults to "http://localhost:3000" in the annotation, 
        // but for this unit test we just inject it manually as Spring would
        ReflectionTestUtils.setField(config, "allowedOrigins", "http://localhost:3000");
        
        CorsConfigurationSource source = config.corsConfigurationSource();
        CorsConfiguration corsConfig = ((UrlBasedCorsConfigurationSource) source).getCorsConfiguration(new org.springframework.mock.web.MockHttpServletRequest("GET", "/api/test"));
        
        assertNotNull(corsConfig);
        List<String> origins = corsConfig.getAllowedOrigins();
        assertNotNull(origins);
        
        assertEquals(1, origins.size());
        assertTrue(origins.contains("http://localhost:3000"));
    }
}

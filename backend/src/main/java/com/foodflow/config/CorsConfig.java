package com.foodflow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Read from properties — different for dev and prod
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        
        // Allow standard HTTP methods
        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // Allow all headers the frontend might send
        configuration.setAllowedHeaders(List.of(
            "Authorization",        // JWT token
            "Content-Type",         // application/json
            "Accept",
            "Origin",
            "X-Requested-With",
            "Cache-Control"
        ));
        
        // Allow frontend to read response headers
        configuration.setExposedHeaders(List.of(
            "Authorization",
            "Content-Disposition"   // for file downloads
        ));
        
        // Allow cookies (needed if you ever add session support)
        configuration.setAllowCredentials(false);
        
        // Cache preflight response for 1 hour
        // Browser won't send OPTIONS request every time
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}

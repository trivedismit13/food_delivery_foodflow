package com.foodflow.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.autoconfigure.actuate.observability.AutoConfigureObservability;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureObservability
@ActiveProfiles("test")
public class ActuatorSecurityTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void healthEndpoint_ShouldBePubliclyAccessible() {
        ResponseEntity<String> response = restTemplate.getForEntity("/actuator/health", String.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().contains("\"status\":\"UP\""));
    }

    @Test
    void prometheusEndpoint_ShouldBePubliclyAccessibleAndReturnMetrics() {
        ResponseEntity<String> actuatorRoot = restTemplate.getForEntity("/actuator", String.class);
        System.out.println("ACTUATOR ROOT RESPONSE: " + actuatorRoot.getBody());

        ResponseEntity<String> response = restTemplate.getForEntity("/actuator/prometheus", String.class);
        assertEquals(HttpStatus.OK, response.getStatusCode(), "Expected 200 OK, got: " + response.getStatusCode() + " body: " + response.getBody());
        assertTrue(response.getBody().contains("jvm_"));
        assertTrue(response.getBody().contains("process_"));
        assertTrue(response.getBody().contains("system_"));
    }

    @Test
    void otherActuatorEndpoints_ShouldBeSecured() {
        ResponseEntity<String> response = restTemplate.getForEntity("/actuator/beans", String.class);
        assertTrue(response.getStatusCode().is4xxClientError());
    }
}


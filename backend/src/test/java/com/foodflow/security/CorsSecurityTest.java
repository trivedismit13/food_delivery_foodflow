package com.foodflow.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class CorsSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void preflight_ValidOrigin_ReturnsAllowedHeaders() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET,POST,PUT,DELETE,PATCH,OPTIONS"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "authorization"));
    }

    @Test
    void preflight_InvalidOrigin_DoesNotReturnAllowOrigin() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                .header(HttpHeaders.ORIGIN, "http://evil.com")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(status().isForbidden()); // Spring Security CORS blocks disallowed origins for preflight with 403
    }

    @Test
    void cors_ValidOriginOnActualRequest_ReturnsAllowOriginHeader() throws Exception {
        // Test an actual public endpoint with Origin header
        mockMvc.perform(post("/api/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"invalid@test.local\", \"password\":\"invalid\"}"))
                .andExpect(status().isUnauthorized()) // 401 because bad creds
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"));
    }

    @Test
    void protectedEndpoint_WithoutToken_ReturnsUnauthorized() throws Exception {
        // Ensures we didn't break security by exposing everything
        mockMvc.perform(get("/api/users/me")
                .header(HttpHeaders.ORIGIN, "http://localhost:3000"))
                .andExpect(status().isForbidden());
    }
}

package com.foodflow.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;
import com.foodflow.model.Role;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "ThisIsAVerySecureSecretKeyForTestingPurposeOnly32BytesMin!");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000);
    }

    @Test
    void testGenerateAndValidateJwtToken() {
        Authentication auth = mock(Authentication.class);
        UserDetailsImpl userDetails = new UserDetailsImpl(
                1L, "Admin", "admin@test.local", "password", Role.ADMIN.name());
        
        when(auth.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(auth);
        
        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("admin@test.local", jwtUtils.getUserEmailFromJwtToken(token));
    }

    @Test
    void testValidateJwtToken_WithDifferentSecret_Fails() {
        Authentication auth = mock(Authentication.class);
        UserDetailsImpl userDetails = new UserDetailsImpl(
                1L, "Admin", "admin@test.local", "password", Role.ADMIN.name());
        when(auth.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(auth);

        // Change secret to simulate invalid signature
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "AnotherVerySecureSecretKeyForTestingPurposeOnly32BytesMin!");
        
        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    void testValidateJwtToken_WhenExpired_Fails() {
        Authentication auth = mock(Authentication.class);
        UserDetailsImpl userDetails = new UserDetailsImpl(
                1L, "Admin", "admin@test.local", "password", Role.ADMIN.name());
        when(auth.getPrincipal()).thenReturn(userDetails);

        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", -1000); // Expired 1 second ago

        String token = jwtUtils.generateJwtToken(auth);

        assertFalse(jwtUtils.validateJwtToken(token));
    }
}

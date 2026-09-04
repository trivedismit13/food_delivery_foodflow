package com.foodflow.config;

import com.foodflow.model.Role;
import com.foodflow.model.User;
import com.foodflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminBootstrapRunnerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AdminBootstrapRunner runner;

    @BeforeEach
    void setUp() {
        runner = new AdminBootstrapRunner(userRepository, passwordEncoder);
    }

    @Test
    void run_WhenDisabled_DoesNothing() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", false);
        
        runner.run();
        
        verify(userRepository, never()).findByEmail(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void run_WhenEnabledButNoEmail_DoesNothing() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "bootstrapEmail", "");
        ReflectionTestUtils.setField(runner, "bootstrapPassword", "pass");

        runner.run();

        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void run_WhenEnabledAndUserDoesNotExist_CreatesAdmin() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "bootstrapEmail", "admin@test.local");
        ReflectionTestUtils.setField(runner, "bootstrapPassword", "secret123");
        ReflectionTestUtils.setField(runner, "bootstrapName", "Custom Admin Name");

        when(userRepository.findByEmail("admin@test.local")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("encodedSecret123");

        runner.run();

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("admin@test.local", savedUser.getEmail());
        assertEquals("encodedSecret123", savedUser.getPassword());
        assertEquals(Role.ADMIN, savedUser.getRole());
        assertTrue(savedUser.getIsActive());
        assertEquals("Custom Admin Name", savedUser.getName());
    }

    @Test
    void run_WhenEnabledAndAdminExists_DoesNotDuplicate() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "bootstrapEmail", "admin@test.local");
        ReflectionTestUtils.setField(runner, "bootstrapPassword", "secret123");

        User existingAdmin = new User();
        existingAdmin.setRole(Role.ADMIN);
        
        when(userRepository.findByEmail("admin@test.local")).thenReturn(Optional.of(existingAdmin));

        runner.run();

        verify(userRepository, never()).save(any());
    }

    @Test
    void run_WhenEnabledAndCustomerExists_AbortsSafe() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "bootstrapEmail", "admin@test.local");
        ReflectionTestUtils.setField(runner, "bootstrapPassword", "secret123");

        User existingCustomer = new User();
        existingCustomer.setRole(Role.CUSTOMER);
        
        when(userRepository.findByEmail("admin@test.local")).thenReturn(Optional.of(existingCustomer));

        runner.run();

        // Should not update customer to admin
        verify(userRepository, never()).save(any());
    }

    @Test
    void run_WhenEnabledAndSellerExists_AbortsSafe() {
        ReflectionTestUtils.setField(runner, "bootstrapEnabled", true);
        ReflectionTestUtils.setField(runner, "bootstrapEmail", "admin@test.local");
        ReflectionTestUtils.setField(runner, "bootstrapPassword", "secret123");

        User existingSeller = new User();
        existingSeller.setRole(Role.SELLER);
        
        when(userRepository.findByEmail("admin@test.local")).thenReturn(Optional.of(existingSeller));

        runner.run();

        // Should not update seller to admin
        verify(userRepository, never()).save(any());
    }
}

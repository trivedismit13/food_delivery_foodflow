package com.foodflow.service.security;

import com.foodflow.dto.request.CreatorRegistrationRequest;
import com.foodflow.dto.request.UserRequest;
import com.foodflow.dto.response.AuthResponse;
import com.foodflow.model.Role;
import com.foodflow.model.User;
import com.foodflow.repository.UserRepository;
import com.foodflow.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
public class RoleAssignmentTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void registerCustomer_ShouldForceRoleToCustomer() {
        UserRequest request = new UserRequest();
        request.setName("Test Customer");
        request.setEmail("customer.test@example.com");
        request.setPhone("1234567890");
        request.setPassword("password123");
        request.setRole(Role.ADMIN); // Attempt to assign ADMIN role

        AuthResponse response = authService.register(request);

        Optional<User> userOpt = userRepository.findById(response.getUserId());
        assertTrue(userOpt.isPresent());
        User savedUser = userOpt.get();

        assertEquals(Role.CUSTOMER, savedUser.getRole(), "Role should be forced to CUSTOMER, ignoring request role");
        assertEquals("CUSTOMER", response.getRole(), "Response should indicate CUSTOMER role");
    }

    @Test
    void registerCreator_ShouldAssignRoleToSeller() {
        CreatorRegistrationRequest request = new CreatorRegistrationRequest();
        request.setName("Test Seller Owner");
        request.setEmail("seller.test@example.com");
        request.setPhone("0987654321");
        request.setPassword("password123");
        request.setCreatorName("Test Kitchen");
        request.setCity("Test City");
        request.setWhatDoYouMake("Test Cuisine");

        AuthResponse response = authService.registerCreator(request);

        Optional<User> userOpt = userRepository.findById(response.getUserId());
        assertTrue(userOpt.isPresent());
        User savedUser = userOpt.get();

        assertEquals(Role.SELLER, savedUser.getRole(), "Role should be SELLER for creator registration");
        assertEquals("SELLER", response.getRole(), "Response should indicate SELLER role");
    }
}

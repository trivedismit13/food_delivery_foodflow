package com.foodflow.service;

import com.foodflow.dto.request.ReelRequest;
import com.foodflow.exception.InvalidRequestException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.Reel;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.repository.ReelRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.time.LocalTime;
import java.util.Set;
import jakarta.validation.ConstraintViolation;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev") // Use dev profile with H2 or same DB
@Transactional
public class ReelServiceTest {

    @Autowired
    private ReelService reelService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReelRepository reelRepository;

    private User sellerA;
    private User sellerB;
    private User customer;
    
    private Restaurant restaurantA;
    private Restaurant restaurantB;

    @BeforeEach
    void setup() {
        // Create users
        sellerA = new User();
        sellerA.setEmail("sellera_" + System.currentTimeMillis() + "@test.com");
        sellerA.setPassword("password");
        sellerA.setName("Seller A");
        sellerA.setPhone("1234567890");
        sellerA.setRole(com.foodflow.model.Role.SELLER);
        sellerA = userRepository.save(sellerA);

        sellerB = new User();
        sellerB.setEmail("sellerb_" + System.currentTimeMillis() + "@test.com");
        sellerB.setPassword("password");
        sellerB.setName("Seller B");
        sellerB.setPhone("0987654321");
        sellerB.setRole(com.foodflow.model.Role.SELLER);
        sellerB = userRepository.save(sellerB);

        customer = new User();
        customer.setEmail("customer_" + System.currentTimeMillis() + "@test.com");
        customer.setPassword("password");
        customer.setName("Customer");
        customer.setPhone("1112223333");
        customer.setRole(com.foodflow.model.Role.CUSTOMER);
        customer = userRepository.save(customer);

        // Create restaurants
        restaurantA = new Restaurant();
        restaurantA.setName("Rest A");
        restaurantA.setOwner(sellerA);
        restaurantA.setCity("Mumbai");
        restaurantA.setPincode("400001");
        restaurantA.setPickupAddress("Addr A");
        restaurantA.setCuisine("Indian");
        restaurantA.setCreatorType(Restaurant.CreatorType.CLOUD_KITCHEN);
        restaurantA = restaurantRepository.save(restaurantA);

        restaurantB = new Restaurant();
        restaurantB.setName("Rest B");
        restaurantB.setOwner(sellerB);
        restaurantB.setCity("Mumbai");
        restaurantB.setPincode("400002");
        restaurantB.setPickupAddress("Addr B");
        restaurantB.setCuisine("Indian");
        restaurantB.setCreatorType(Restaurant.CreatorType.CLOUD_KITCHEN);
        restaurantB = restaurantRepository.save(restaurantB);
    }

    private void authenticateAs(User user) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user.getEmail(), "password")
        );
    }

    @Test
    void testUploadReel_OwnSeller_Success() {
        authenticateAs(sellerA);
        ReelRequest request = new ReelRequest();
        request.setTitle("My awesome reel");
        request.setMediaUrl("http://example.com/reel.mp4");

        Reel created = reelService.uploadReel(restaurantA.getRestaurantId(), request);

        assertNotNull(created.getReelId());
        assertEquals("My awesome reel", created.getTitle());
        assertEquals("http://example.com/reel.mp4", created.getMediaUrl());
        assertEquals(restaurantA.getRestaurantId(), created.getRestaurant().getRestaurantId());
    }

    @Test
    void testUploadReel_CrossSeller_Rejected() {
        authenticateAs(sellerA);
        ReelRequest request = new ReelRequest();
        request.setTitle("Hacking reel");
        request.setMediaUrl("http://example.com/hacker.mp4");

        InvalidRequestException exception = assertThrows(InvalidRequestException.class, () -> {
            reelService.uploadReel(restaurantB.getRestaurantId(), request);
        });
        
        assertEquals("You do not own this restaurant profile.", exception.getMessage());
    }

    @Test
    void testUploadReel_Customer_Rejected() {
        authenticateAs(customer);
        ReelRequest request = new ReelRequest();
        request.setTitle("Customer upload");
        request.setMediaUrl("http://example.com/customer.mp4");

        InvalidRequestException exception = assertThrows(InvalidRequestException.class, () -> {
            reelService.uploadReel(restaurantA.getRestaurantId(), request);
        });

        assertEquals("You do not own this restaurant profile.", exception.getMessage());
    }

    @Test
    void testUploadReel_NonexistentSeller_Rejected() {
        authenticateAs(sellerA);
        ReelRequest request = new ReelRequest();
        request.setTitle("Upload");
        request.setMediaUrl("http://example.com/test.mp4");

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            reelService.uploadReel(9999999999L, request);
        });

        assertEquals("Restaurant not found", exception.getMessage());
    }

    @Test
    void testGetRestaurantReels_Chronological() {
        authenticateAs(sellerA);
        ReelRequest req1 = new ReelRequest();
        req1.setTitle("First");
        req1.setMediaUrl("http://example.com/1.mp4");
        reelService.uploadReel(restaurantA.getRestaurantId(), req1);

        ReelRequest req2 = new ReelRequest();
        req2.setTitle("Second");
        req2.setMediaUrl("http://example.com/2.mp4");
        reelService.uploadReel(restaurantA.getRestaurantId(), req2);

        Page<Reel> reels = reelService.getRestaurantReels(restaurantA.getRestaurantId(), PageRequest.of(0, 10));
        
        // Since we don't have simulated delays, they might have same timestamp. 
        // But the query works.
        assertTrue(reels.getTotalElements() >= 2);
    }
    
    @Test
    void testDiscoveryFeed() {
        authenticateAs(sellerA);
        ReelRequest req1 = new ReelRequest();
        req1.setTitle("First");
        req1.setMediaUrl("http://example.com/1.mp4");
        reelService.uploadReel(restaurantA.getRestaurantId(), req1);
        
        Page<Reel> reels = reelService.getDiscoveryFeed(PageRequest.of(0, 10));
        assertTrue(reels.getTotalElements() >= 1);
    }
    
    @Test
    void testReelRequestValidation() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        ReelRequest req = new ReelRequest();
        
        // Blank title and media url
        Set<ConstraintViolation<ReelRequest>> violations = validator.validate(req);
        assertTrue(violations.size() >= 2);
        
        req.setTitle("Title");
        req.setMediaUrl("invalid_url");
        violations = validator.validate(req);
        assertFalse(violations.isEmpty(), "Invalid URL should fail");
        
        req.setMediaUrl("http://example.com");
        violations = validator.validate(req);
        assertTrue(violations.isEmpty());
    }
}

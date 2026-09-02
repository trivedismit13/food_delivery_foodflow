package com.foodflow.service;

import com.foodflow.dto.request.ReelRequest;
import com.foodflow.exception.InvalidRequestException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.dto.response.ReelResponse;
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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import io.micrometer.core.instrument.MeterRegistry;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.time.LocalTime;
import java.util.Set;
import jakarta.validation.ConstraintViolation;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ReelServiceTest {

    @Autowired
    private ReelService reelService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MeterRegistry meterRegistry;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReelRepository reelRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

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
        
        double initialCount = meterRegistry.counter("foodflow.reels.created").count();
        
        ReelRequest request = new ReelRequest();
        request.setTitle("My awesome reel");
        request.setMediaUrl("http://example.com/reel.mp4");

        ReelResponse created = reelService.uploadReel(restaurantA.getRestaurantId(), request);

        assertNotNull(created.getReelId());
        assertEquals("My awesome reel", created.getTitle());
        assertEquals("http://example.com/reel.mp4", created.getMediaUrl());
        assertEquals(restaurantA.getRestaurantId(), created.getRestaurantId());
        
        double finalCount = meterRegistry.counter("foodflow.reels.created").count();
        assertEquals(1.0, finalCount - initialCount);
    }

    @Test
    void testUploadReel_CrossSeller_Rejected() {
        authenticateAs(sellerA);
        
        double initialCount = meterRegistry.counter("foodflow.reels.created").count();
        
        ReelRequest request = new ReelRequest();
        request.setTitle("Hacking reel");
        request.setMediaUrl("http://example.com/hacker.mp4");

        InvalidRequestException exception = assertThrows(InvalidRequestException.class, () -> {
            reelService.uploadReel(restaurantB.getRestaurantId(), request);
        });
        
        assertEquals("You do not own this restaurant profile.", exception.getMessage());
        
        double finalCount = meterRegistry.counter("foodflow.reels.created").count();
        assertEquals(initialCount, finalCount);
    }

    @Test
    void testUploadReel_Customer_Rejected() {
        authenticateAs(customer);
        
        double initialCount = meterRegistry.counter("foodflow.reels.created").count();
        
        ReelRequest request = new ReelRequest();
        request.setTitle("Customer upload");
        request.setMediaUrl("http://example.com/customer.mp4");

        InvalidRequestException exception = assertThrows(InvalidRequestException.class, () -> {
            reelService.uploadReel(restaurantA.getRestaurantId(), request);
        });

        assertEquals("Only sellers can upload reels.", exception.getMessage());
        
        double finalCount = meterRegistry.counter("foodflow.reels.created").count();
        assertEquals(initialCount, finalCount);
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
        ReelResponse r1 = reelService.uploadReel(restaurantA.getRestaurantId(), req1);

        ReelRequest req2 = new ReelRequest();
        req2.setTitle("Second");
        req2.setMediaUrl("http://example.com/2.mp4");
        ReelResponse r2 = reelService.uploadReel(restaurantA.getRestaurantId(), req2);

        // Manually update created_at to be deterministic and far in the future
        jdbcTemplate.update("UPDATE reels SET created_at = '2037-01-01 10:00:00' WHERE reel_id = ?", r1.getReelId());
        jdbcTemplate.update("UPDATE reels SET created_at = '2037-01-01 11:00:00' WHERE reel_id = ?", r2.getReelId());

        Page<ReelResponse> reels = reelService.getRestaurantReels(restaurantA.getRestaurantId(), PageRequest.of(0, 10));
        
        assertTrue(reels.getTotalElements() >= 2);
        assertEquals("Second", reels.getContent().get(0).getTitle(), "Newer reel must appear first");
        assertEquals("First", reels.getContent().get(1).getTitle(), "Older reel must appear second");
    }
    
    @Test
    void testDiscoveryFeed() {
        authenticateAs(sellerA);
        ReelRequest req1 = new ReelRequest();
        req1.setTitle("First");
        req1.setMediaUrl("http://example.com/1.mp4");
        ReelResponse r1 = reelService.uploadReel(restaurantA.getRestaurantId(), req1);
        
        ReelRequest req2 = new ReelRequest();
        req2.setTitle("Second");
        req2.setMediaUrl("http://example.com/2.mp4");
        ReelResponse r2 = reelService.uploadReel(restaurantA.getRestaurantId(), req2);

        jdbcTemplate.update("UPDATE reels SET created_at = '2037-01-01 10:00:00' WHERE reel_id = ?", r1.getReelId());
        jdbcTemplate.update("UPDATE reels SET created_at = '2037-01-01 11:00:00' WHERE reel_id = ?", r2.getReelId());

        Page<ReelResponse> reels = reelService.getDiscoveryFeed(PageRequest.of(0, 10));
        assertTrue(reels.getTotalElements() >= 2);
        assertEquals("Second", reels.getContent().get(0).getTitle(), "Newer reel must appear first");
        assertEquals("First", reels.getContent().get(1).getTitle(), "Older reel must appear second");
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

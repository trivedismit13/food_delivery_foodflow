package com.foodflow.service.security;

import com.foodflow.model.FoodDrop;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@SpringBootTest
public class SecurityAdversarialTest {

    @Autowired
    private CreatorAuthorizationService authorizationService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RestaurantRepository restaurantRepository;

    @MockBean
    private FoodDropRepository dropRepository;

    @Test
    void assertCreatorOwnsDrop_ThrowsAccessDeniedException_WhenMismatchedCreator() {
        SecurityContextImpl context = new SecurityContextImpl();
        context.setAuthentication(new UsernamePasswordAuthenticationToken("hacker@example.com", "password"));
        SecurityContextHolder.setContext(context);

        User hackerUser = new User();
        hackerUser.setUserId(10L);
        hackerUser.setEmail("hacker@example.com");

        when(userRepository.findByEmail("hacker@example.com")).thenReturn(Optional.of(hackerUser));

        Restaurant hackerRestaurant = new Restaurant();
        hackerRestaurant.setRestaurantId(20L);
        when(restaurantRepository.findByOwnerUserId(10L)).thenReturn(Optional.of(hackerRestaurant));

        Restaurant victimRestaurant = new Restaurant();
        victimRestaurant.setRestaurantId(99L); 

        FoodDrop targetDrop = new FoodDrop();
        targetDrop.setDropId(100L);
        targetDrop.setCreator(victimRestaurant);

        when(dropRepository.findById(100L)).thenReturn(Optional.of(targetDrop));

        assertThrows(AccessDeniedException.class, () -> {
            authorizationService.assertCreatorOwnsDrop(100L);
        });
    }
}

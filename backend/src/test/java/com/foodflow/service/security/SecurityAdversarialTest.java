package com.foodflow.service.security;

import com.foodflow.model.FoodDrop;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.UserRepository;
import com.foodflow.repository.OrderRepository;
import com.foodflow.model.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;

import java.util.Optional;
import java.util.List;

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

    @MockBean
    private OrderRepository orderRepository;

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

    @Test
    void assertCanAccessOrder_ThrowsAccessDeniedException_WhenCustomerAccessesOtherOrder() {
        SecurityContextImpl context = new SecurityContextImpl();
        context.setAuthentication(new UsernamePasswordAuthenticationToken("customer@example.com", "password"));
        SecurityContextHolder.setContext(context);

        User customerUser = new User();
        customerUser.setUserId(50L);
        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(customerUser));

        User otherUser = new User();
        otherUser.setUserId(51L);
        
        Order targetOrder = new Order();
        targetOrder.setOrderId(300L);
        targetOrder.setUser(otherUser);

        when(orderRepository.findById(300L)).thenReturn(Optional.of(targetOrder));

        assertThrows(AccessDeniedException.class, () -> {
            authorizationService.assertCanAccessOrder(300L);
        });
    }

    @Test
    void assertCanAccessOrder_ThrowsAccessDeniedException_WhenSellerAccessesOtherRestaurantOrder() {
        SecurityContextImpl context = new SecurityContextImpl();
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "seller@example.com", "password", List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_SELLER")));
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        User sellerUser = new User();
        sellerUser.setUserId(60L);
        when(userRepository.findByEmail("seller@example.com")).thenReturn(Optional.of(sellerUser));

        Restaurant sellerRestaurant = new Restaurant();
        sellerRestaurant.setRestaurantId(200L);
        when(restaurantRepository.findByOwnerUserId(60L)).thenReturn(Optional.of(sellerRestaurant));

        Restaurant otherRestaurant = new Restaurant();
        otherRestaurant.setRestaurantId(201L);

        Order targetOrder = new Order();
        targetOrder.setOrderId(400L);
        targetOrder.setRestaurant(otherRestaurant);
        when(restaurantRepository.findById(201L)).thenReturn(Optional.of(otherRestaurant));

        when(orderRepository.findById(400L)).thenReturn(Optional.of(targetOrder));

        assertThrows(AccessDeniedException.class, () -> {
            authorizationService.assertCanAccessOrder(400L);
        });
    }

    @Test
    void assertCanManageDropOrder_ThrowsAccessDeniedException_WhenMismatchedDropId() {
        Order targetOrder = new Order();
        targetOrder.setOrderId(200L);
        FoodDrop actualDrop = new FoodDrop();
        actualDrop.setDropId(101L);
        targetOrder.setDrop(actualDrop);

        when(orderRepository.findById(200L)).thenReturn(Optional.of(targetOrder));

        assertThrows(AccessDeniedException.class, () -> {
            authorizationService.assertCanManageDropOrder(200L, 102L); // 102 != 101
        }, "Order does not belong to the specified drop");
    }

    @Test
    void assertCanManageDropOrder_ThrowsAccessDeniedException_WhenNoDrop() {
        Order targetOrder = new Order();
        targetOrder.setOrderId(200L);
        targetOrder.setDrop(null);

        when(orderRepository.findById(200L)).thenReturn(Optional.of(targetOrder));

        assertThrows(AccessDeniedException.class, () -> {
            authorizationService.assertCanManageDropOrder(200L, 102L);
        }, "Order does not belong to the specified drop");
    }
}

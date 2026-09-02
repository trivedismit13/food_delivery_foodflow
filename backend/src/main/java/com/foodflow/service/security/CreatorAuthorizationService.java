package com.foodflow.service.security;

import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.FoodDrop;
import com.foodflow.model.Order;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.repository.OrderRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreatorAuthorizationService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodDropRepository dropRepository;
    private final OrderRepository orderRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
    }

    private Restaurant getAuthenticatedCreator() {
        User user = getAuthenticatedUser();
        return restaurantRepository.findByOwnerUserId(user.getUserId())
                .orElseThrow(() -> new AccessDeniedException("User is not a creator"));
    }

    public void assertCreatorOwnsDrop(Long dropId) {
        Restaurant creator = getAuthenticatedCreator();
        FoodDrop drop = dropRepository.findById(dropId)
                .orElseThrow(() -> new ResourceNotFoundException("Drop not found"));
        if (!drop.getCreator().getRestaurantId().equals(creator.getRestaurantId())) {
            throw new AccessDeniedException("You do not have permission to modify this drop");
        }
    }

    public void assertCreatorOwnsVerification(Long creatorId) {
        Restaurant creator = getAuthenticatedCreator();
        if (!creator.getRestaurantId().equals(creatorId)) {
            throw new AccessDeniedException("You do not have permission to modify this verification");
        }
    }

    public void assertCreatorOwnsAnalytics(Long creatorId) {
        Restaurant creator = getAuthenticatedCreator();
        if (!creator.getRestaurantId().equals(creatorId)) {
            throw new AccessDeniedException("You do not have permission to view analytics for this creator");
        }
    }

    public void assertUserOwnsOrder(Long orderId) {
        User user = getAuthenticatedUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getUserId().equals(user.getUserId())) {
            throw new AccessDeniedException("You do not have permission to access this order");
        }
    }
    
    public void assertUserMatches(Long userId) {
        User user = getAuthenticatedUser();
        if (!user.getUserId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to access these records");
        }
    }

    /**
     * Asserts that the currently authenticated SELLER user owns the restaurant
     * identified by {@code restaurantId}. ADMIN users are implicitly allowed
     * and skip the ownership check.
     */
    public void assertCreatorOwnsRestaurant(Long restaurantId) {
        org.springframework.security.core.Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return; // Admins may manage any restaurant
        }
        User user = getAuthenticatedUser();
        Restaurant ownerRestaurant = restaurantRepository.findByOwnerUserId(user.getUserId())
                .orElseThrow(() -> new AccessDeniedException("You do not have a restaurant profile"));
        Restaurant targetRestaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        if (!ownerRestaurant.getRestaurantId().equals(targetRestaurant.getRestaurantId())) {
            throw new AccessDeniedException("You do not have permission to modify this restaurant");
        }
    }

    /**
     * Asserts that the currently authenticated SELLER user owns the restaurant
     * associated with the given {@code orderId}. ADMIN users are implicitly allowed.
     */
    public void assertCreatorOwnsOrderRestaurant(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        assertCreatorOwnsRestaurant(order.getRestaurant().getRestaurantId());
    }

    public void assertCanManageDropOrder(Long orderId, Long dropId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (order.getDrop() == null || !order.getDrop().getDropId().equals(dropId)) {
            throw new AccessDeniedException("Order does not belong to the specified drop");
        }
        
        org.springframework.security.core.Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return;
        }

        boolean isSeller = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"));
                
        if (isSeller) {
            assertCreatorOwnsRestaurant(order.getRestaurant().getRestaurantId());
        } else {
            User user = getAuthenticatedUser();
            if (!order.getUser().getUserId().equals(user.getUserId())) {
                throw new AccessDeniedException("You do not have permission to access this order");
            }
        }
    }

    public void assertCanAccessOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
                
        org.springframework.security.core.Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return;
        }

        boolean isSeller = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"));
                
        if (isSeller) {
            assertCreatorOwnsRestaurant(order.getRestaurant().getRestaurantId());
        } else {
            User user = getAuthenticatedUser();
            if (!order.getUser().getUserId().equals(user.getUserId())) {
                throw new AccessDeniedException("You do not have permission to access this order");
            }
        }
    }
}

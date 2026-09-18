package com.foodflow.service.order;

import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.dto.response.OrderResponse;
import com.foodflow.exception.InvalidOrderException;
import com.foodflow.model.*;
import com.foodflow.repository.*;
import com.foodflow.service.DropOrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class DropOrderCancellationTest {

    @Autowired
    private DropOrderService dropOrderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FoodDropRepository dropRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;
    
    @Autowired
    private DropItemRepository dropItemRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TransactionTemplate transactionTemplate;

    private User testUser;
    private FoodDrop testDrop;
    private OrderResponse placedOrder;

    @BeforeEach
    void setup() {
        // Run everything in a transaction to set up cleanly
        transactionTemplate.execute(status -> {
            // Setup User
            testUser = userRepository.findByEmail("test@cancellation.com").orElse(null);
            if (testUser == null) {
                testUser = new User();
                testUser.setEmail("test@cancellation.com");
                testUser.setPassword("password");
                testUser.setName("Test User");
                testUser.setRole(com.foodflow.model.Role.CUSTOMER);
                userRepository.save(testUser);
            }

            // Setup Creator
            User creatorUser = userRepository.findByEmail("creator@cancellation.com").orElse(null);
            if (creatorUser == null) {
                creatorUser = new User();
                creatorUser.setEmail("creator@cancellation.com");
                creatorUser.setPassword("password");
                creatorUser.setName("Creator User");
                creatorUser.setRole(com.foodflow.model.Role.SELLER);
                userRepository.save(creatorUser);
            }

            Restaurant restaurant = restaurantRepository.findByOwnerUserId(creatorUser.getUserId()).orElse(null);
            if (restaurant == null) {
                restaurant = new Restaurant();
                restaurant.setName("Test Restaurant");
                restaurant.setOwner(creatorUser);
                restaurant.setPickupAddress("Test Address");
                restaurant.setCity("Test City");
                restaurant.setPincode("123456");
                restaurant.setCuisine("Desserts");
                restaurant.setCreatorType(Restaurant.CreatorType.HOME_BAKER);
                restaurant.setIsAcceptingOrders(true);
                restaurantRepository.save(restaurant);
            }

            // Setup MenuItem
            MenuItem menuItem = new MenuItem();
            menuItem.setRestaurant(restaurant);
            menuItem.setName("Test Item");
            menuItem.setDescription("Test Item Desc");
            menuItem.setPrice(new BigDecimal("10.00"));
            menuItem.setAvailableQty(10);
            menuItem.setIsVeg(true);
            menuItem.setCategory("Main");
            menuItemRepository.save(menuItem);

            // Setup Drop
            testDrop = new FoodDrop();
            testDrop.setCreator(restaurant);
            testDrop.setTitle("Test Drop");
            testDrop.setDescription("Test Drop Desc");
            testDrop.setDropDate(LocalDate.now().plusDays(1));
            // Cutoff in the future for ordering
            testDrop.setOrderCutoffTime(LocalDateTime.now(java.time.ZoneOffset.UTC).plusHours(1)); 
            testDrop.setPickupTime("18:00");
            testDrop.setPickupLocation("Test Location");
            testDrop.setMaxOrders(10);
            testDrop.setCurrentOrders(0);
            testDrop.setStatus(FoodDrop.DropStatus.OPEN);
            dropRepository.save(testDrop);

            DropItem dropItem = new DropItem();
            dropItem.setDrop(testDrop);
            dropItem.setMenuItem(menuItem);
            dropItem.setDropPrice(new BigDecimal("10.00"));
            dropItem.setQuantityAvailable(10);
            dropItemRepository.save(dropItem);

            return null;
        });

        // Set Auth to customer
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(testUser.getEmail(), "password", List.of())
        );

        // Place an order
        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(testDrop.getDropId());
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        FoodDrop reloadedDrop = dropRepository.findById(testDrop.getDropId()).orElseThrow();
        itemReq.setItemId(reloadedDrop.getDropItems().get(0).getMenuItem().getItemId());
        itemReq.setQuantity(1);
        request.setItems(List.of(itemReq));

        placedOrder = dropOrderService.placeDropOrder(testUser.getUserId(), request);
    }

    @Test
    void testCannotCancelAfterCutoff() {
        // Move cutoff to past
        transactionTemplate.execute(status -> {
            FoodDrop dropToUpdate = dropRepository.findById(testDrop.getDropId()).orElseThrow();
            dropToUpdate.setOrderCutoffTime(LocalDateTime.now().minusMinutes(5));
            dropRepository.save(dropToUpdate);
            return null;
        });

        // Store pre-cancellation state
        Order orderBefore = orderRepository.findById(placedOrder.getOrderId()).orElseThrow();
        FoodDrop dropBefore = dropRepository.findById(testDrop.getDropId()).orElseThrow();
        DropItem dropItemBefore = dropBefore.getDropItems().get(0);
        int currentOrdersBefore = dropBefore.getCurrentOrders();
        int itemQtyAvailableBefore = dropItemBefore.getQuantityAvailable();
        int itemQtyOrderedBefore = dropItemBefore.getQuantityOrdered();
        Payment paymentBefore = paymentRepository.findByOrderOrderId(orderBefore.getOrderId()).orElseThrow();

        // Attempt cancellation
        InvalidOrderException exception = assertThrows(InvalidOrderException.class, () -> {
            dropOrderService.cancelDropOrder(placedOrder.getOrderId());
        });
        assertEquals("Order cannot be cancelled after the drop cutoff time", exception.getMessage());

        // Assert state remains unchanged
        transactionTemplate.execute(status -> {
            Order orderAfter = orderRepository.findById(placedOrder.getOrderId()).orElseThrow();
            FoodDrop dropAfter = dropRepository.findById(testDrop.getDropId()).orElseThrow();
            DropItem dropItemAfter = dropAfter.getDropItems().get(0);
            Payment paymentAfter = paymentRepository.findByOrderOrderId(orderAfter.getOrderId()).orElseThrow();

            assertEquals(OrderStatus.PLACED, orderAfter.getStatus(), "Order status should remain PLACED");
            assertEquals(currentOrdersBefore, dropAfter.getCurrentOrders(), "Drop current orders should remain unchanged");
            assertEquals(itemQtyAvailableBefore, dropItemAfter.getQuantityAvailable(), "Drop item quantityAvailable should remain unchanged");
            assertEquals(itemQtyOrderedBefore, dropItemAfter.getQuantityOrdered(), "Drop item quantityOrdered should remain unchanged");
            assertEquals(paymentBefore.getStatus(), paymentAfter.getStatus(), "Payment status should remain unchanged");
            return null;
        });
    }
}

package com.foodflow.service;

import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.exception.InvalidOrderException;
import com.foodflow.model.*;
import com.foodflow.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class DropOrderServiceConcurrencyTest {

    @Autowired
    private DropOrderService dropOrderService;

    @Autowired
    private FoodDropRepository dropRepository;

    @Autowired
    private DropItemRepository dropItemRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    private Long dropId;
    private Long menuItemId;
    private Long userAId;
    private Long userBId;

    @BeforeEach
    @Transactional
    void setUp() {
        // Clean up repositories
        dropItemRepository.deleteAll();
        dropRepository.deleteAll();
        menuItemRepository.deleteAll();
        userRepository.deleteAll();
        restaurantRepository.deleteAll();

        // Create a seller (restaurant owner)
        User seller = User.builder().email("seller@example.com").name("Seller").role(UserRole.SELLER).build();
        seller = userRepository.save(seller);
        Restaurant restaurant = Restaurant.builder().owner(seller).name("TestRestaurant").isOpen(true).build();
        restaurant = restaurantRepository.save(restaurant);

        // Create a menu item with 1 quantity
        MenuItem menuItem = MenuItem.builder()
                .restaurant(restaurant)
                .name("TestItem")
                .price(BigDecimal.valueOf(10))
                .availableQty(1)
                .build();
        menuItem = menuItemRepository.save(menuItem);
        menuItemId = menuItem.getItemId();

        // Create a drop with maxOrders=1
        FoodDrop drop = FoodDrop.builder()
                .creator(restaurant)
                .title("TestDrop")
                .status(FoodDrop.DropStatus.OPEN)
                .orderCutoffTime(LocalDateTime.now().plusHours(1))
                .maxOrders(1)
                .currentOrders(0)
                .pickupTime(LocalDateTime.now().plusHours(2))
                .build();
        drop = dropRepository.save(drop);
        dropId = drop.getDropId();

        // Add DropItem linked to the menu item, quantityAvailable=1
        DropItem dropItem = DropItem.builder()
                .drop(drop)
                .menuItem(menuItem)
                .quantityAvailable(1)
                .quantityOrdered(0)
                .build();
        dropItemRepository.save(dropItem);

        // Create two customers
        User userA = User.builder().email("a@example.com").name("A").role(UserRole.CUSTOMER).build();
        userA = userRepository.save(userA);
        userAId = userA.getUserId();
        User userB = User.builder().email("b@example.com").name("B").role(UserRole.CUSTOMER).build();
        userB = userRepository.save(userB);
        userBId = userB.getUserId();
    }

    @Test
    @WithMockUser(username = "a@example.com", roles = {"CUSTOMER"})
    void concurrentBookingMaxOrdersInvariant() throws Exception {
        // Both users attempt to place an order for the same drop concurrently
        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(dropId);
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        itemReq.setItemId(menuItemId);
        itemReq.setQuantity(1);
        request.setItems(Collections.singletonList(itemReq));

        Callable<Void> taskA = () -> {
            dropOrderService.placeDropOrder(userAId, request);
            return null;
        };
        Callable<Void> taskB = () -> {
            dropOrderService.placeDropOrder(userBId, request);
            return null;
        };

        ExecutorService executor = Executors.newFixedThreadPool(2);
        Future<Void> futureA = executor.submit(taskA);
        Future<Void> futureB = executor.submit(taskB);
        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        int successCount = 0;
        int failureCount = 0;
        for (Future<Void> f : new Future[]{futureA, futureB}) {
            try {
                f.get();
                successCount++;
            } catch (ExecutionException ee) {
                assertTrue(ee.getCause() instanceof InvalidOrderException);
                failureCount++;
            }
        }
        assertEquals(1, successCount, "Exactly one booking should succeed");
        assertEquals(1, failureCount, "Exactly one booking should fail");
    }

    @Test
    @WithMockUser(username = "a@example.com", roles = {"CUSTOMER"})
    void concurrentBookingQuantityInvariant() throws Exception {
        // Same setup as above but the drop allows unlimited orders; we test quantityAvailable=1
        // Update drop to allow many orders
        FoodDrop drop = dropRepository.findById(dropId).orElseThrow();
        drop.setMaxOrders(10);
        dropRepository.save(drop);

        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(dropId);
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        itemReq.setItemId(menuItemId);
        itemReq.setQuantity(1);
        request.setItems(Collections.singletonList(itemReq));

        Callable<Void> taskA = () -> {
            dropOrderService.placeDropOrder(userAId, request);
            return null;
        };
        Callable<Void> taskB = () -> {
            dropOrderService.placeDropOrder(userBId, request);
            return null;
        };

        ExecutorService executor = Executors.newFixedThreadPool(2);
        Future<Void> futureA = executor.submit(taskA);
        Future<Void> futureB = executor.submit(taskB);
        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        int successCount = 0;
        int failureCount = 0;
        for (Future<Void> f : new Future[]{futureA, futureB}) {
            try {
                f.get();
                successCount++;
            } catch (ExecutionException ee) {
                assertTrue(ee.getCause() instanceof InvalidOrderException);
                failureCount++;
            }
        }
        assertEquals(1, successCount, "Only one order should consume the available quantity");
        assertEquals(1, failureCount, "The other order should be rejected due to insufficient inventory");
    }
}

package com.foodflow.service.order;

import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.model.*;
import com.foodflow.repository.*;
import com.foodflow.service.DropOrderService;
import com.foodflow.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ConcurrencyAdversarialTest {

    @Autowired
    private DropOrderService dropOrderService;

    @Autowired
    private FoodDropRepository dropRepository;

    @Autowired
    private DropItemRepository dropItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @MockBean
    private PaymentService paymentService;

    private Long testDropId;
    private Long testUserId;
    private Long testItemId;

    @BeforeEach
    void setup() {
        User user = new User();
        user.setEmail("concurrent" + System.currentTimeMillis() + "@test.com");
        user.setPassword("hash");
        user.setName("Test User");
        user.setRole(com.foodflow.model.Role.CUSTOMER);
        user = userRepository.save(user);
        testUserId = user.getUserId();

        Restaurant restaurant = new Restaurant();
        restaurant.setOwner(user);
        restaurant.setName("Concurrent Rest");
        restaurant.setCity("Test City");
        restaurant.setCuisine("Test Cuisine");
        restaurant.setCreatorType(Restaurant.CreatorType.WEEKEND_CHEF);
        restaurant = restaurantRepository.save(restaurant);

        FoodDrop drop = new FoodDrop();
        drop.setCreator(restaurant);
        drop.setTitle("Concurrent Drop");
        drop.setDropDate(LocalDate.now().plusDays(1));
        drop.setOrderCutoffTime(LocalDateTime.now().plusHours(2));
        drop.setMaxOrders(2);
        drop.setCurrentOrders(0);
        drop.setStatus(FoodDrop.DropStatus.OPEN);
        // drop.setIsDeliveryAvailable(true); // obsolete
        drop = dropRepository.save(drop);
        testDropId = drop.getDropId();

        MenuItem menuItem = new MenuItem();
        menuItem.setRestaurant(restaurant);
        menuItem.setName("Item 1");
        menuItem.setPrice(BigDecimal.TEN);
        menuItem.setCategory("Test");
        menuItem.setIsVeg(true);
        menuItem = menuItemRepository.save(menuItem);

        DropItem dropItem = new DropItem();
        dropItem.setDrop(drop);
        dropItem.setMenuItem(menuItem);
        dropItem.setQuantityAvailable(10);
        dropItem.setDropPrice(BigDecimal.TEN);
        dropItem.setQuantityOrdered(0);
        dropItem = dropItemRepository.save(dropItem);
        testItemId = dropItem.getDropItemId();
        
        when(paymentService.processPayment(any())).thenReturn(new Payment());
    }

    @Test
    void placeDropOrder_Concurrent_AllowsOnlyMaxOrders() throws InterruptedException {
        int numberOfThreads = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);
        
        List<Exception> exceptions = new java.util.concurrent.CopyOnWriteArrayList<>();

        for (int i = 0; i < numberOfThreads; i++) {
            executorService.execute(() -> {
                try {
                    PlaceDropOrderRequest request = new PlaceDropOrderRequest();
                    request.setDropId(testDropId);
                    // request.setPaymentMethod("PAY_AT_PICKUP"); // obsolete
                    
                    PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
                    itemReq.setItemId(testItemId);
                    itemReq.setQuantity(1);
                    request.setItems(List.of(itemReq));

                    dropOrderService.placeDropOrder(testUserId, request);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    System.err.println("Exception in thread:");
                    e.printStackTrace();
                    failCount.incrementAndGet();
                    exceptions.add(e);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();

        assertEquals(2, successCount.get(), "Exactly 2 orders should succeed");
        assertEquals(8, failCount.get(), "Exactly 8 orders should fail gracefully");
        
        FoodDrop drop = dropRepository.findById(testDropId).orElseThrow();
        assertEquals(successCount.get(), drop.getCurrentOrders(), "currentOrders must exactly equal the number of successful bookings");
    }
    
    @Test
    void test3_SoldOutDrop() {
        FoodDrop drop = dropRepository.findById(testDropId).orElseThrow();
        drop.setCurrentOrders(2);
        dropRepository.save(drop);
        
        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(testDropId);
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        itemReq.setItemId(testItemId);
        itemReq.setQuantity(1);
        request.setItems(List.of(itemReq));

        org.junit.jupiter.api.Assertions.assertThrows(
            com.foodflow.exception.InvalidOrderException.class, 
            () -> dropOrderService.placeDropOrder(testUserId, request)
        );
    }
    
    @Test
    void test4_Cutoff() {
        FoodDrop drop = dropRepository.findById(testDropId).orElseThrow();
        drop.setOrderCutoffTime(LocalDateTime.now().minusHours(1));
        dropRepository.save(drop);
        
        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(testDropId);
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        itemReq.setItemId(testItemId);
        itemReq.setQuantity(1);
        request.setItems(List.of(itemReq));

        org.junit.jupiter.api.Assertions.assertThrows(
            com.foodflow.exception.InvalidOrderException.class, 
            () -> dropOrderService.placeDropOrder(testUserId, request)
        );
    }
    
    @Test
    void test5_CancellationRestoresCapacity() {
        // Place one order successfully
        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(testDropId);
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        itemReq.setItemId(testItemId);
        itemReq.setQuantity(1);
        request.setItems(List.of(itemReq));

        com.foodflow.dto.response.OrderResponse response = dropOrderService.placeDropOrder(testUserId, request);
        
        // Setup authentication mock for cancellation
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken("concurrent" + testUserId, "password")
        );
        // Wait, user email was "concurrent" + System.currentTimeMillis() + "@test.com"
        User u = userRepository.findById(testUserId).orElseThrow();
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(u.getEmail(), "password")
        );

        dropOrderService.cancelDropOrder(response.getOrderId());
        
        FoodDrop drop = dropRepository.findById(testDropId).orElseThrow();
        assertEquals(0, drop.getCurrentOrders());
        
        DropItem item = dropItemRepository.findById(testItemId).orElseThrow();
        assertEquals(0, item.getQuantityOrdered());
    }
    
    @Test
    void test6_CancellationAndBookingContention() throws InterruptedException {
        // We start with max 2. Place 1 order.
        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(testDropId);
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        itemReq.setItemId(testItemId);
        itemReq.setQuantity(1);
        request.setItems(List.of(itemReq));

        com.foodflow.dto.response.OrderResponse response = dropOrderService.placeDropOrder(testUserId, request);
        
        User u = userRepository.findById(testUserId).orElseThrow();
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(u.getEmail(), "password")
        );

        // Now run 1 thread cancelling, and 5 threads booking.
        int bookingThreads = 5;
        ExecutorService executorService = Executors.newFixedThreadPool(bookingThreads + 1);
        CountDownLatch latch = new CountDownLatch(bookingThreads + 1);
        
        AtomicInteger successCount = new AtomicInteger(0);
        List<Exception> unexpectedExceptions = new java.util.concurrent.CopyOnWriteArrayList<>();

        executorService.execute(() -> {
            try {
                // Thread-local SecurityContext for cancellation
                org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(u.getEmail(), "password")
                );
                dropOrderService.cancelDropOrder(response.getOrderId());
            } catch (Exception e) {
                unexpectedExceptions.add(e);
            } finally {
                latch.countDown();
            }
        });

        for (int i = 0; i < bookingThreads; i++) {
            executorService.execute(() -> {
                try {
                    PlaceDropOrderRequest req = new PlaceDropOrderRequest();
                    req.setDropId(testDropId);
                    PlaceDropOrderRequest.ItemRequest iReq = new PlaceDropOrderRequest.ItemRequest();
                    iReq.setItemId(testItemId);
                    iReq.setQuantity(1);
                    req.setItems(List.of(iReq));

                    dropOrderService.placeDropOrder(testUserId, req);
                    successCount.incrementAndGet();
                } catch (com.foodflow.exception.InvalidOrderException e) {
                    // Expected when sold out
                } catch (Exception e) {
                    unexpectedExceptions.add(e);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();
        
        org.junit.jupiter.api.Assertions.assertTrue(unexpectedExceptions.isEmpty(), "Unexpected exceptions occurred: " + unexpectedExceptions);
        
        Order cancelledOrder = orderRepository.findById(response.getOrderId()).orElseThrow();
        assertEquals(OrderStatus.CANCELLED, cancelledOrder.getStatus(), "The cancellation should have succeeded");
        
        FoodDrop drop = dropRepository.findById(testDropId).orElseThrow();
        org.junit.jupiter.api.Assertions.assertTrue(drop.getCurrentOrders() >= 0 && drop.getCurrentOrders() <= drop.getMaxOrders(), "Orders bounds invalid");
        assertEquals(successCount.get(), drop.getCurrentOrders(), "Final currentOrders should equal the number of successful concurrent bookings");
        
        long activeOrders = orderRepository.findAll().stream()
            .filter(o -> o.getDrop() != null && o.getDrop().getDropId().equals(testDropId) && o.getStatus() != OrderStatus.CANCELLED)
            .count();
            
        assertEquals(activeOrders, drop.getCurrentOrders(), "currentOrders must exactly match the number of active, non-cancelled persisted orders");
    }
}

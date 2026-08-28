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

        for (Exception e : exceptions) {
            assertEquals(com.foodflow.exception.InvalidOrderException.class, e.getClass(),
                "Exceptions should be gracefully handled as InvalidOrderException");
        }
    }
}

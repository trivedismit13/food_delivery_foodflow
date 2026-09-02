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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;
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

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PlatformTransactionManager transactionManager;

    private TransactionTemplate transactionTemplate;

    @BeforeEach
    void setUp() {
        transactionTemplate = new TransactionTemplate(transactionManager);
    }

    private Long createTestCustomer() {
        return transactionTemplate.execute(status -> {
            String uuid = UUID.randomUUID().toString();
            User user = User.builder().email("concurrency-" + uuid + "@example.com").name("Test Customer").role(Role.CUSTOMER).build();
            user.setPassword("password");
            return userRepository.save(user).getUserId();
        });
    }

    private Long[] setupDropWithConfig(int maxOrders, int quantityAvailable) {
        return transactionTemplate.execute(status -> {
            String uuid = UUID.randomUUID().toString();
            User seller = User.builder().email("seller-" + uuid + "@example.com").name("Seller").role(Role.SELLER).build();
            seller.setPassword("password");
            seller = userRepository.save(seller);
            
            Restaurant restaurant = Restaurant.builder()
                .owner(seller)
                .name("Res-" + uuid)
                .city("Test City")
                .cuisine("Italian")
                .pickupAddress("123 Test St")
                .pincode("123456")
                .isOpen(true)
                .build();
            restaurant = restaurantRepository.save(restaurant);

            MenuItem menuItem = MenuItem.builder()
                .restaurant(restaurant)
                .name("Item-" + uuid)
                .price(BigDecimal.TEN)
                .availableQty(100)
                .category("Main Course")
                .isVeg(true)
                .build();
            menuItem = menuItemRepository.save(menuItem);

            FoodDrop drop = FoodDrop.builder()
                    .creator(restaurant)
                    .title("Drop-" + uuid)
                    .status(FoodDrop.DropStatus.OPEN)
                    .orderCutoffTime(LocalDateTime.now().plusHours(1))
                    .maxOrders(maxOrders)
                    .currentOrders(0)
                    .pickupTime("12:00 PM")
                    .dropDate(java.time.LocalDate.now())
                    .build();
            drop = dropRepository.save(drop);

            DropItem dropItem = DropItem.builder()
                    .drop(drop)
                    .menuItem(menuItem)
                    .quantityAvailable(quantityAvailable)
                    .quantityOrdered(0)
                    .build();
            dropItemRepository.save(dropItem);

            return new Long[]{drop.getDropId(), menuItem.getItemId()};
        });
    }

    @Test
    void capacityRaceTest() throws Exception {
        Long[] setupIds = setupDropWithConfig(1, 10);
        Long dropId = setupIds[0];
        Long menuItemId = setupIds[1];

        Long userAId = createTestCustomer();
        Long userBId = createTestCustomer();

        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(dropId);
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        itemReq.setItemId(menuItemId);
        itemReq.setQuantity(1);
        request.setItems(Collections.singletonList(itemReq));

        CountDownLatch readyLatch = new CountDownLatch(2);
        CountDownLatch startLatch = new CountDownLatch(1);

        Callable<Void> taskA = () -> {
            readyLatch.countDown();
            startLatch.await();
            dropOrderService.placeDropOrder(userAId, request);
            return null;
        };

        Callable<Void> taskB = () -> {
            readyLatch.countDown();
            startLatch.await();
            dropOrderService.placeDropOrder(userBId, request);
            return null;
        };

        ExecutorService executor = Executors.newFixedThreadPool(2);
        Future<Void> futureA = executor.submit(taskA);
        Future<Void> futureB = executor.submit(taskB);

        readyLatch.await();
        startLatch.countDown();

        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        int successCount = 0;
        int failureCount = 0;
        for (Future<Void> f : new Future[]{futureA, futureB}) {
            try {
                f.get();
                successCount++;
            } catch (ExecutionException ee) {
                if (ee.getCause() instanceof InvalidOrderException) {
                    failureCount++;
                } else {
                    fail("Unexpected exception: " + ee.getCause());
                }
            }
        }

        assertEquals(1, successCount, "Exactly one success");
        assertEquals(1, failureCount, "Exactly one expected business failure");

        // Verify Capacity in Database
        transactionTemplate.execute(status -> {
            FoodDrop drop = dropRepository.findById(dropId).orElseThrow();
            assertEquals(1, drop.getCurrentOrders(), "currentOrders == 1");
            assertTrue(drop.getCurrentOrders() <= drop.getMaxOrders(), "currentOrders <= maxOrders");
            
            long successfulOrdersCount = orderRepository.findByDropDropId(dropId).size();
            assertEquals(1, successfulOrdersCount, "successful orders == 1");
            return null;
        });
    }

    @Test
    void inventoryRaceTest() throws Exception {
        Long[] setupIds = setupDropWithConfig(10, 1);
        Long dropId = setupIds[0];
        Long menuItemId = setupIds[1];

        Long userAId = createTestCustomer();
        Long userBId = createTestCustomer();

        PlaceDropOrderRequest request = new PlaceDropOrderRequest();
        request.setDropId(dropId);
        PlaceDropOrderRequest.ItemRequest itemReq = new PlaceDropOrderRequest.ItemRequest();
        itemReq.setItemId(menuItemId);
        itemReq.setQuantity(1);
        request.setItems(Collections.singletonList(itemReq));

        CountDownLatch readyLatch = new CountDownLatch(2);
        CountDownLatch startLatch = new CountDownLatch(1);

        Callable<Void> taskA = () -> {
            readyLatch.countDown();
            startLatch.await();
            dropOrderService.placeDropOrder(userAId, request);
            return null;
        };

        Callable<Void> taskB = () -> {
            readyLatch.countDown();
            startLatch.await();
            dropOrderService.placeDropOrder(userBId, request);
            return null;
        };

        ExecutorService executor = Executors.newFixedThreadPool(2);
        Future<Void> futureA = executor.submit(taskA);
        Future<Void> futureB = executor.submit(taskB);

        readyLatch.await();
        startLatch.countDown();

        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        int successCount = 0;
        int failureCount = 0;
        for (Future<Void> f : new Future[]{futureA, futureB}) {
            try {
                f.get();
                successCount++;
            } catch (ExecutionException ee) {
                if (ee.getCause() instanceof InvalidOrderException) {
                    failureCount++;
                }
            }
        }

        assertEquals(1, successCount, "exactly 1 success");
        assertEquals(1, failureCount, "exactly 1 expected inventory failure");

        // Verify Inventory in Database
        transactionTemplate.execute(status -> {
            DropItem dropItem = dropItemRepository.findByDropDropId(dropId).stream().filter(di -> di.getMenuItem().getItemId().equals(menuItemId)).findFirst().orElseThrow();
            assertTrue(dropItem.getQuantityOrdered() <= dropItem.getQuantityAvailable(), "quantityOrdered <= quantityAvailable");
            assertEquals(1, dropItem.getQuantityOrdered(), "quantityOrdered == 1");
            return null;
        });
    }
}

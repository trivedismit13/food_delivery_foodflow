package com.foodflow.service;

import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.dto.response.OrderResponse;
import com.foodflow.exception.InvalidOrderException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.*;
import com.foodflow.repository.*;
import com.foodflow.service.impl.DropOrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import jakarta.persistence.EntityManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DropOrderServiceImplTest {

    @Mock
    private FoodDropRepository dropRepository;
    @Mock
    private DropItemRepository dropItemRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private PaymentService paymentService;
    @Mock
    private RestaurantRepository restaurantRepository;
    @Mock
    private ApplicationEventPublisher eventPublisher;
    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private DropOrderServiceImpl dropOrderService;

    private User testUser;
    private FoodDrop testDrop;
    private DropItem testDropItem;
    private PlaceDropOrderRequest testRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(2L);
        testUser.setEmail("customer@test.com");

        Restaurant rest = new Restaurant();
        rest.setRestaurantId(10L);
        User creatorUser = new User();
        creatorUser.setUserId(1L);
        rest.setOwner(creatorUser);

        testDrop = new FoodDrop();
        testDrop.setDropId(1L);
        testDrop.setStatus(FoodDrop.DropStatus.OPEN);
        testDrop.setOrderCutoffTime(LocalDateTime.now().plusHours(1));
        testDrop.setMaxOrders(10);
        testDrop.setCurrentOrders(0);
        testDrop.setCreator(rest);

        MenuItem menuItem = new MenuItem();
        menuItem.setItemId(100L);
        menuItem.setName("Taco");
        menuItem.setPrice(BigDecimal.valueOf(10));
        menuItem.setRestaurant(rest);

        testDropItem = new DropItem();
        testDropItem.setDropItemId(1000L);
        testDropItem.setDrop(testDrop);
        testDropItem.setMenuItem(menuItem);
        testDropItem.setQuantityAvailable(5);
        testDropItem.setQuantityOrdered(0);

        testRequest = new PlaceDropOrderRequest();
        testRequest.setDropId(1L);
        List<PlaceDropOrderRequest.ItemRequest> items = new ArrayList<>();
        PlaceDropOrderRequest.ItemRequest ir = new PlaceDropOrderRequest.ItemRequest();
        ir.setItemId(100L);
        ir.setQuantity(2);
        items.add(ir);
        testRequest.setItems(items);
    }

    @Test
    void testValidDropBooking() {
        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.of(testDrop));
        when(dropItemRepository.findByDropAndItemWithLock(1L, 100L)).thenReturn(Optional.of(testDropItem));
        when(userRepository.getReferenceById(2L)).thenReturn(testUser);
        when(orderRepository.save(any())).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setOrderId(500L);
            return o;
        });

        OrderResponse res = dropOrderService.placeDropOrder(2L, testRequest);
        assertNotNull(res);
        assertEquals(500L, res.getOrderId());
        verify(orderRepository).save(any());
        verify(dropItemRepository).save(any());
        verify(paymentService).createPayment(any());
    }

    @Test
    void testNonexistentDrop() {
        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> dropOrderService.placeDropOrder(2L, testRequest));
    }

    @Test
    void testEmptyItemList() {
        testRequest.setItems(new ArrayList<>());
        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.of(testDrop));
        assertThrows(InvalidOrderException.class, () -> dropOrderService.placeDropOrder(2L, testRequest));
    }

    @Test
    void testQuantityZeroOrLess() {
        testRequest.getItems().get(0).setQuantity(0);
        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.of(testDrop));
        assertThrows(InvalidOrderException.class, () -> dropOrderService.placeDropOrder(2L, testRequest));
    }

    @Test
    void testNonexistentItem() {
        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.of(testDrop));
        when(dropItemRepository.findByDropAndItemWithLock(1L, 100L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> dropOrderService.placeDropOrder(2L, testRequest));
    }

    @Test
    void testInsufficientDropItemQuantity() {
        testRequest.getItems().get(0).setQuantity(6); // Available is 5
        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.of(testDrop));
        when(dropItemRepository.findByDropAndItemWithLock(1L, 100L)).thenReturn(Optional.of(testDropItem));
        assertThrows(InvalidOrderException.class, () -> dropOrderService.placeDropOrder(2L, testRequest));
    }

    @Test
    void testDropAtOrAfterCutoff() {
        testDrop.setOrderCutoffTime(LocalDateTime.now().minusMinutes(1));
        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.of(testDrop));
        assertThrows(InvalidOrderException.class, () -> dropOrderService.placeDropOrder(2L, testRequest));
    }

    @Test
    void testDropAlreadyFull() {
        testDrop.setCurrentOrders(10);
        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.of(testDrop));
        assertThrows(InvalidOrderException.class, () -> dropOrderService.placeDropOrder(2L, testRequest));
    }
}

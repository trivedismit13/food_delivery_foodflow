package com.foodflow.service;

import com.foodflow.exception.InvalidOrderException;
import com.foodflow.model.Order;
import com.foodflow.model.Order;
import com.foodflow.model.OrderStatus;
import com.foodflow.model.User;
import com.foodflow.model.Restaurant;
import com.foodflow.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private MenuItemRepository menuItemRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RestaurantRepository restaurantRepository;
    @Mock
    private PaymentService paymentService;
    @Mock
    private NotificationService notificationService;

    @Spy
    private MeterRegistry meterRegistry = new SimpleMeterRegistry();

    @InjectMocks
    private OrderServiceImpl orderService;

    @ParameterizedTest
    @CsvSource({
            "PLACED, PREPARING",
            "PLACED, CANCELLED",
            "PREPARING, READY",
            "PREPARING, CANCELLED",
            "READY, COMPLETED",
            "PLACED, PLACED",
            "PREPARING, PREPARING",
            "READY, READY",
            "COMPLETED, COMPLETED",
            "CANCELLED, CANCELLED"
    })
    void testValidTransitions(OrderStatus current, OrderStatus requested) {
        assertDoesNotThrow(() -> orderService.validateOrderStatusTransition(current, requested));
    }

    @ParameterizedTest
    @CsvSource({
            "PLACED, READY",
            "PLACED, COMPLETED",
            "PREPARING, PLACED",
            "PREPARING, COMPLETED",
            "READY, PLACED",
            "READY, PREPARING",
            "READY, CANCELLED",
            "COMPLETED, PLACED",
            "COMPLETED, PREPARING",
            "COMPLETED, READY",
            "COMPLETED, CANCELLED",
            "CANCELLED, PLACED",
            "CANCELLED, PREPARING",
            "CANCELLED, READY",
            "CANCELLED, COMPLETED"
    })
    void testInvalidTransitions(OrderStatus current, OrderStatus requested) {
        assertThrows(InvalidOrderException.class, 
            () -> orderService.validateOrderStatusTransition(current, requested));
    }

    private Order createTestOrder(Long id, OrderStatus status) {
        Order order = new Order();
        order.setOrderId(id);
        order.setStatus(status);
        User user = new User();
        user.setUserId(1L);
        order.setUser(user);
        Restaurant rest = new Restaurant();
        rest.setRestaurantId(2L);
        rest.setName("Test Rest");
        order.setRestaurant(rest);
        return order;
    }

    @Test
    void testUpdateOrderStatus_Valid() {
        Order order = createTestOrder(1L, OrderStatus.PLACED);
        
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        
        orderService.updateOrderStatus(1L, OrderStatus.PREPARING);
        
        verify(orderRepository).save(order);
    }

    @Test
    void testUpdateOrderStatus_CancellationTrigger() {
        Order order = createTestOrder(2L, OrderStatus.PLACED);
        
        when(orderRepository.findById(2L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        
        com.foodflow.model.Payment payment = new com.foodflow.model.Payment();
        payment.setPaymentId(2L);
        when(paymentService.getPaymentByOrderId(2L)).thenReturn(Optional.of(payment));
        
        orderService.updateOrderStatus(2L, OrderStatus.CANCELLED);
        
        verify(paymentService).cancelPayment(2L);
        verify(orderRepository).save(order);
    }

    @Test
    void testUpdateOrderStatus_Invalid() {
        Order order = createTestOrder(3L, OrderStatus.COMPLETED);
        
        when(orderRepository.findById(3L)).thenReturn(Optional.of(order));
        
        assertThrows(InvalidOrderException.class, () -> {
            orderService.updateOrderStatus(3L, OrderStatus.CANCELLED);
        });
        
        verify(orderRepository, never()).save(any());
        verify(paymentService, never()).cancelPayment(anyLong());
        
        // Assert metric
        org.junit.jupiter.api.Assertions.assertEquals(0, meterRegistry.counter("foodflow.orders.cancelled").count());
    }

    @Test
    void testMetrics_OrderCancelled_Success() {
        Order order = createTestOrder(2L, OrderStatus.PLACED);
        when(orderRepository.findById(2L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        
        com.foodflow.model.Payment payment = new com.foodflow.model.Payment();
        payment.setPaymentId(2L);
        when(paymentService.getPaymentByOrderId(2L)).thenReturn(Optional.of(payment));
        
        orderService.updateOrderStatus(2L, OrderStatus.CANCELLED);
        
        org.junit.jupiter.api.Assertions.assertEquals(1, meterRegistry.counter("foodflow.orders.cancelled").count());
    }

    @Test
    void testMetrics_OrderCreated_Success() {
        Order order = createTestOrder(1L, OrderStatus.PLACED);
        when(userRepository.findById(1L)).thenReturn(Optional.of(order.getUser()));
        when(restaurantRepository.findById(2L)).thenReturn(Optional.of(order.getRestaurant()));
        order.getRestaurant().setIsOpen(true);
        when(orderRepository.save(any())).thenAnswer(i -> {
            Order o = i.getArgument(0);
            o.setOrderId(1L);
            return o;
        });

        com.foodflow.dto.request.OrderItemRequest req = new com.foodflow.dto.request.OrderItemRequest();
        req.setItemId(10L);
        req.setQuantity(1);

        com.foodflow.model.MenuItem item = new com.foodflow.model.MenuItem();
        item.setItemId(10L);
        item.setRestaurant(order.getRestaurant());
        item.setAvailableQty(5);
        item.setPrice(java.math.BigDecimal.TEN);
        item.setName("Item");
        when(menuItemRepository.findById(10L)).thenReturn(Optional.of(item));

        orderService.placeOrder(1L, 2L, java.util.Collections.singletonList(req));

        org.junit.jupiter.api.Assertions.assertEquals(1, meterRegistry.counter("foodflow.orders.created").count());
    }

    @Test
    void testMetrics_OrderCreated_Failure() {
        Order order = createTestOrder(1L, OrderStatus.PLACED);
        when(userRepository.findById(1L)).thenReturn(Optional.of(order.getUser()));
        when(restaurantRepository.findById(2L)).thenReturn(Optional.of(order.getRestaurant()));
        order.getRestaurant().setIsOpen(false); // closed

        assertThrows(InvalidOrderException.class, () -> {
            orderService.placeOrder(1L, 2L, java.util.Collections.emptyList());
        });

        org.junit.jupiter.api.Assertions.assertEquals(0, meterRegistry.counter("foodflow.orders.created").count());
    }

    @Test
    void testMetrics_OrderCancelled_Rollback_MetricNotIncremented() {
        Order order = createTestOrder(3L, OrderStatus.PLACED);
        when(orderRepository.findById(3L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        
        com.foodflow.model.Payment payment = new com.foodflow.model.Payment();
        payment.setPaymentId(3L);
        when(paymentService.getPaymentByOrderId(3L)).thenReturn(Optional.of(payment));
        
        // Force existing failure path: payment cancellation fails
        doThrow(new RuntimeException("Payment cancellation failed"))
            .when(paymentService).cancelPayment(3L);
        
        assertThrows(RuntimeException.class, () -> {
            orderService.updateOrderStatus(3L, OrderStatus.CANCELLED);
        });
        
        // Metric remains unchanged because it rolls back (or fails before increment fallback)
        org.junit.jupiter.api.Assertions.assertEquals(0, meterRegistry.counter("foodflow.orders.cancelled").count());
    }
}

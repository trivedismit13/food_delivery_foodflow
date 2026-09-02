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
import org.mockito.junit.jupiter.MockitoExtension;

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
    }
}

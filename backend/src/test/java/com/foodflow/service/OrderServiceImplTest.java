package com.foodflow.service;

import com.foodflow.exception.InvalidOrderException;
import com.foodflow.model.OrderStatus;
import com.foodflow.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@Import({OrderServiceImpl.class})
public class OrderServiceImplTest {

    @Autowired
    private OrderServiceImpl orderService;

    @Test
    void validTransitions() {
        // These should NOT throw exceptions
        orderService.validateOrderStatusTransition(OrderStatus.PLACED, OrderStatus.PREPARING);
        orderService.validateOrderStatusTransition(OrderStatus.PREPARING, OrderStatus.READY);
        orderService.validateOrderStatusTransition(OrderStatus.READY, OrderStatus.COMPLETED);
        orderService.validateOrderStatusTransition(OrderStatus.PLACED, OrderStatus.CANCELLED);
        orderService.validateOrderStatusTransition(OrderStatus.PREPARING, OrderStatus.CANCELLED);
    }

    @Test
    void invalidTransitionsThrow() {
        // PLACED -> READY
        assertThrows(InvalidOrderException.class,
                () -> orderService.validateOrderStatusTransition(OrderStatus.PLACED, OrderStatus.READY));
        // PLACED -> COMPLETED
        assertThrows(InvalidOrderException.class,
                () -> orderService.validateOrderStatusTransition(OrderStatus.PLACED, OrderStatus.COMPLETED));
        // PREPARING -> COMPLETED
        assertThrows(InvalidOrderException.class,
                () -> orderService.validateOrderStatusTransition(OrderStatus.PREPARING, OrderStatus.COMPLETED));
        // COMPLETED -> ANY
        assertThrows(InvalidOrderException.class,
                () -> orderService.validateOrderStatusTransition(OrderStatus.COMPLETED, OrderStatus.CANCELLED));
        // CANCELLED -> ANY
        assertThrows(InvalidOrderException.class,
                () -> orderService.validateOrderStatusTransition(OrderStatus.CANCELLED, OrderStatus.PLACED));
    }
}

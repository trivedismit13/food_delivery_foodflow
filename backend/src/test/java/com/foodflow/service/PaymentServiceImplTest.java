package com.foodflow.service;

import com.foodflow.exception.InvalidRequestException;
import com.foodflow.model.Order;
import com.foodflow.model.Payment;
import com.foodflow.model.PaymentStatus;
import com.foodflow.repository.PaymentRepository;
import com.foodflow.service.security.CreatorAuthorizationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;
import com.foodflow.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CreatorAuthorizationService authorizationService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        
        org.springframework.security.core.GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_SELLER");
        lenient().when(authentication.getAuthorities()).thenAnswer(invocation -> Collections.singleton(authority));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void markPaymentCollected_Success() {
        Long paymentId = 1L;
        Payment payment = new Payment();
        payment.setPaymentId(paymentId);
        payment.setStatus(PaymentStatus.PENDING);
        
        Order order = new Order();
        order.setOrderId(100L);
        payment.setOrder(order);

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(payment));
        doNothing().when(authorizationService).assertCreatorOwnsOrderRestaurant(100L);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(i -> i.getArgument(0));

        Payment result = paymentService.markPaymentCollected(paymentId);
        
        assertEquals(PaymentStatus.COLLECTED, result.getStatus());
        assertNotNull(result.getPaymentDate());
    }

    @Test
    void markPaymentCollected_FailsWhenNotPending() {
        Long paymentId = 1L;
        Payment payment = new Payment();
        payment.setPaymentId(paymentId);
        payment.setStatus(PaymentStatus.CANCELLED);
        
        Order order = new Order();
        order.setOrderId(100L);
        payment.setOrder(order);

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(payment));
        doNothing().when(authorizationService).assertCreatorOwnsOrderRestaurant(100L);

        assertThrows(InvalidRequestException.class, () -> {
            paymentService.markPaymentCollected(paymentId);
        });
    }

    @Test
    void markPaymentCollected_UnauthorizedFails() {
        Long paymentId = 1L;
        Payment payment = new Payment();
        payment.setPaymentId(paymentId);
        payment.setStatus(PaymentStatus.PENDING);
        
        Order order = new Order();
        order.setOrderId(100L);
        payment.setOrder(order);

        when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(payment));
        doThrow(new AccessDeniedException("Not your order")).when(authorizationService).assertCreatorOwnsOrderRestaurant(100L);

        assertThrows(AccessDeniedException.class, () -> {
            paymentService.markPaymentCollected(paymentId);
        });
    }
}

package com.foodflow.service;

import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.Payment;
import com.foodflow.model.PaymentStatus;
import com.foodflow.repository.PaymentRepository;
import com.foodflow.service.security.CreatorAuthorizationService;
import com.foodflow.exception.InvalidRequestException;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import com.foodflow.model.User;
import com.foodflow.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final CreatorAuthorizationService authorizationService;
    private final UserRepository userRepository;
    private final MeterRegistry meterRegistry;

    @Override
    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderOrderId(orderId).orElse(null);
        if (payment != null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin) {
                User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new AccessDeniedException("User not found"));
                boolean isCustomer = payment.getOrder().getUser().getUserId().equals(user.getUserId());
                boolean isSeller = payment.getOrder().getRestaurant().getOwner().getUserId().equals(user.getUserId());
                if (!isCustomer && !isSeller) {
                    throw new AccessDeniedException("Not authorized to view this payment");
                }
            }
        }
        return Optional.ofNullable(payment);
    }

    @Override
    @Transactional
    public Payment markPaymentCollected(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        authorizationService.assertCreatorOwnsOrderRestaurant(payment.getOrder().getOrderId());
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isSeller = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"));
        if (!isSeller) {
            throw new AccessDeniedException("Only a SELLER can collect payments");
        }

        if (payment.getStatus() == PaymentStatus.COLLECTED) {
            return payment; // Idempotent
        }
        
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new InvalidRequestException("Cannot collect payment that is " + payment.getStatus());
        }

        payment.setStatus(PaymentStatus.COLLECTED);
        payment.setPaymentDate(LocalDateTime.now());
        payment = paymentRepository.save(payment);
        if (org.springframework.transaction.support.TransactionSynchronizationManager.isSynchronizationActive()) {
            org.springframework.transaction.support.TransactionSynchronizationManager.registerSynchronization(
                new org.springframework.transaction.support.TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        meterRegistry.counter("foodflow.payments.collected").increment();
                    }
                }
            );
        } else {
            meterRegistry.counter("foodflow.payments.collected").increment();
        }
        return payment;
    }

    @Override
    @Transactional
    public Payment cancelPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.CANCELLED) {
            return payment;
        }

        if (payment.getStatus() == PaymentStatus.COLLECTED) {
            throw new InvalidRequestException("Cannot cancel a collected payment");
        }

        payment.setStatus(PaymentStatus.CANCELLED);
        return paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }
}

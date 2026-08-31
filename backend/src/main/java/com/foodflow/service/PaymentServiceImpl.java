package com.foodflow.service;

import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.Payment;
import com.foodflow.model.PaymentStatus;
import com.foodflow.repository.PaymentRepository;
import com.foodflow.service.security.CreatorAuthorizationService;
import com.foodflow.exception.InvalidRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final CreatorAuthorizationService authorizationService;

    @Override
    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderOrderId(orderId);
    }

    @Override
    @Transactional
    public Payment markPaymentCollected(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        authorizationService.assertCreatorOwnsOrderRestaurant(payment.getOrder().getOrderId());

        if (payment.getStatus() == PaymentStatus.COLLECTED) {
            return payment; // Idempotent
        }
        
        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new InvalidRequestException("Cannot collect payment that is " + payment.getStatus());
        }

        payment.setStatus(PaymentStatus.COLLECTED);
        payment.setPaymentDate(LocalDateTime.now());
        return paymentRepository.save(payment);
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

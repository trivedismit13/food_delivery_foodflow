package com.foodflow.service;

import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.Payment;
import com.foodflow.model.PaymentStatus;
import com.foodflow.repository.PaymentRepository;
import com.foodflow.service.payment.PaymentProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final PaymentProvider paymentProvider;

    @Override
    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderOrderId(orderId);
    }

    @Override
    @Transactional
    public Payment updatePaymentStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public Payment processPayment(Payment payment) {
        payment = paymentProvider.processPayment(payment);
        return paymentRepository.save(payment);
    }
}

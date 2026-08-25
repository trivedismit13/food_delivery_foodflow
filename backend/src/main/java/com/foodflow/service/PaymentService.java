package com.foodflow.service;

import com.foodflow.model.Payment;
import com.foodflow.model.PaymentStatus;

import java.util.Optional;

public interface PaymentService {
    Optional<Payment> getPaymentByOrderId(Long orderId);
    Payment updatePaymentStatus(Long paymentId, PaymentStatus status);
    Payment processPayment(Payment payment);
}

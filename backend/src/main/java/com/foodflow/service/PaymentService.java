package com.foodflow.service;

import com.foodflow.model.Payment;
import com.foodflow.model.PaymentStatus;

import java.util.Optional;

public interface PaymentService {
    Optional<Payment> getPaymentByOrderId(Long orderId);
    Payment markPaymentCollected(Long paymentId);
    Payment cancelPayment(Long paymentId);
    Payment createPayment(Payment payment);
}

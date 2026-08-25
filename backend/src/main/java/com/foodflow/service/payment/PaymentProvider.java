package com.foodflow.service.payment;

import com.foodflow.model.Payment;

public interface PaymentProvider {
    Payment processPayment(Payment payment);
}

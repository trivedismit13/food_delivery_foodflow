package com.foodflow.service.payment;

import com.foodflow.model.Payment;
import com.foodflow.model.PaymentStatus;
import org.springframework.stereotype.Component;

@Component
public class MockPaymentProvider implements PaymentProvider {

    @Override
    public Payment processPayment(Payment payment) {
        // In a real scenario, this would call Stripe/PayPal etc.
        // For now, simulate success by marking it as PENDING (or COMPLETED if desired)
        payment.setStatus(PaymentStatus.PENDING);
        return payment;
    }
}

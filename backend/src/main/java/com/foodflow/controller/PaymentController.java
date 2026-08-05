package com.foodflow.controller;

import com.foodflow.dto.response.ApiResponse;
import com.foodflow.model.Payment;
import com.foodflow.model.PaymentStatus;
import com.foodflow.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> checkPaymentStatus(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId)
                .map(p -> ResponseEntity.ok(ApiResponse.success(p)))
                .orElse(ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body(ApiResponse.error("Payment not found", 404)));
    }

    @PutMapping("/{paymentId}/status")
    public ResponseEntity<ApiResponse<Payment>> simulateWebhookCallback(@PathVariable Long paymentId, @RequestParam PaymentStatus status) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.updatePaymentStatus(paymentId, status)));
    }
}

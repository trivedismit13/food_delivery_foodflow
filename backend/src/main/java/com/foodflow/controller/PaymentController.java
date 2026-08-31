package com.foodflow.controller;

import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.PaymentResponse;
import com.foodflow.model.Payment;
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
    public ResponseEntity<ApiResponse<PaymentResponse>> checkPaymentStatus(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId)
                .map(p -> ResponseEntity.ok(ApiResponse.success(mapToResponse(p))))
                .orElse(ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body(ApiResponse.error("Payment not found", 404)));
    }

    @PutMapping("/order/{orderId}/collect")
    public ResponseEntity<ApiResponse<PaymentResponse>> markPaymentCollected(@PathVariable Long orderId) {
        Payment payment = paymentService.getPaymentByOrderId(orderId)
            .orElseThrow(() -> new com.foodflow.exception.ResourceNotFoundException("Payment not found"));
        Payment collected = paymentService.markPaymentCollected(payment.getPaymentId());
        return ResponseEntity.ok(ApiResponse.success(mapToResponse(collected)));
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderId(payment.getOrder().getOrderId())
                .method(payment.getMethod().name())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
}

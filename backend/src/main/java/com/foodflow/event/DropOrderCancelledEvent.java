package com.foodflow.event;

import org.springframework.context.ApplicationEvent;

public class DropOrderCancelledEvent extends ApplicationEvent {
    
    private final Long orderId;

    public DropOrderCancelledEvent(Object source, Long orderId) {
        super(source);
        this.orderId = orderId;
    }

    public Long getOrderId() {
        return orderId;
    }
}

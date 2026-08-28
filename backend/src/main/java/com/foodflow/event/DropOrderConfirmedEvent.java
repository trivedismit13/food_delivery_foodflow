package com.foodflow.event;

import org.springframework.context.ApplicationEvent;

public class DropOrderConfirmedEvent extends ApplicationEvent {
    
    private final Long userId;
    private final Long orderId;
    private final String dropTitle;
    private final String pickupTime;
    private final Long dropId;
    private final Integer currentOrders;
    private final Integer maxOrders;

    public DropOrderConfirmedEvent(Object source, Long userId, Long orderId, String dropTitle, 
                                   String pickupTime, Long dropId, Integer currentOrders, Integer maxOrders) {
        super(source);
        this.userId = userId;
        this.orderId = orderId;
        this.dropTitle = dropTitle;
        this.pickupTime = pickupTime;
        this.dropId = dropId;
        this.currentOrders = currentOrders;
        this.maxOrders = maxOrders;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getDropTitle() {
        return dropTitle;
    }

    public String getPickupTime() {
        return pickupTime;
    }

    public Long getDropId() {
        return dropId;
    }

    public Integer getCurrentOrders() {
        return currentOrders;
    }

    public Integer getMaxOrders() {
        return maxOrders;
    }
}

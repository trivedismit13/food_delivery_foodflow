package com.foodflow.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class LowStockEvent extends ApplicationEvent {
    private final Long creatorId;
    private final Long dropId;
    private final String dropTitle;
    private final String itemName;
    private final int remaining;

    public LowStockEvent(Object source, Long creatorId, Long dropId, String dropTitle, String itemName, int remaining) {
        super(source);
        this.creatorId = creatorId;
        this.dropId = dropId;
        this.dropTitle = dropTitle;
        this.itemName = itemName;
        this.remaining = remaining;
    }
}

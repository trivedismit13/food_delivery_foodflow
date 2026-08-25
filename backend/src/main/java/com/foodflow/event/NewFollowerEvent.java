package com.foodflow.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class NewFollowerEvent extends ApplicationEvent {
    private final Long creatorId;
    private final Long followerId;
    private final String followerName;

    public NewFollowerEvent(Object source, Long creatorId, Long followerId, String followerName) {
        super(source);
        this.creatorId = creatorId;
        this.followerId = followerId;
        this.followerName = followerName;
    }
}

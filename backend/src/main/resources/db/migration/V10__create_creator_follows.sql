CREATE TABLE creator_follows (
    follow_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    follower_id     BIGINT NOT NULL,
    creator_id      BIGINT NOT NULL,
    followed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_follow (follower_id, creator_id),
    -- Can't follow same creator twice

    FOREIGN KEY (follower_id) REFERENCES users(user_id),
    FOREIGN KEY (creator_id) REFERENCES restaurants(restaurant_id)
);

CREATE INDEX idx_follows_creator ON creator_follows(creator_id);
CREATE INDEX idx_follows_follower ON creator_follows(follower_id);

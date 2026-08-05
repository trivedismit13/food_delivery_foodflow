CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    
    type            ENUM(
                        'DROP_ANNOUNCED',    -- creator you follow announced a drop
                        'DROP_OPEN',         -- drop you were waiting for is now accepting orders
                        'DROP_CLOSING_SOON', -- 1 hour before cutoff
                        'ORDER_CONFIRMED',   -- your pre-order was confirmed
                        'ORDER_READY',       -- your food is ready for collection
                        'ORDER_CANCELLED',   -- drop was cancelled
                        'NEW_FOLLOWER',      -- someone followed your creator profile
                        'LOW_STOCK'          -- item in your drop is running low (for creators)
                    ),
    
    title           VARCHAR(200) NOT NULL,
    message         TEXT NOT NULL,
    
    reference_type  ENUM('DROP', 'ORDER', 'USER') NULL,
    reference_id    BIGINT NULL,
    -- Polymorphic reference: drop_id, order_id, or user_id
    -- Used for deep-linking to the relevant page
    
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
-- Composite index for "get all unread notifications for user" query

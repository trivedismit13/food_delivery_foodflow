-- A DROP is a limited-time, limited-quantity food release
-- Example: "Sunday Biryani Drop — 20 portions, order by Saturday 8PM, 
--           collect Sunday 12-2PM"
-- This is the core new concept that doesn't exist on Instagram/WhatsApp

CREATE TABLE food_drops (
    drop_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    creator_id          BIGINT NOT NULL,
    
    title               VARCHAR(200) NOT NULL,
    -- "Sunday Special Biryani Drop"
    
    description         TEXT,
    -- "Made with aged basmati, slow cooked overnight. Only 20 portions."
    
    drop_date           DATE NOT NULL,
    -- The date when customers collect or receive

    order_cutoff_time   TIMESTAMP NOT NULL,
    -- Orders close at this time. After this, no new orders accepted.
    -- WHY: Creator needs to know final count before they start cooking
    -- Example: Saturday 8PM cutoff for Sunday delivery

    pickup_start_time   TIMESTAMP NULL,
    pickup_end_time     TIMESTAMP NULL,
    -- Collection window. NULL if delivery only.
    -- Example: Sunday 12:00 PM to 2:00 PM

    max_orders          INT NOT NULL DEFAULT 20,
    -- Hard cap. System enforces this atomically.
    current_orders      INT DEFAULT 0,
    -- Denormalized counter. Incremented atomically in transaction.
    -- WHY denormalized: COUNT(*) on every order check at high traffic 
    -- is expensive. Atomic increment is O(1).

    status              ENUM(
                            'DRAFT',      -- creator still setting up
                            'ANNOUNCED',  -- visible, not yet accepting orders
                            'OPEN',       -- accepting orders
                            'CUTOFF',     -- order window closed, cooking
                            'READY',      -- food ready for collection
                            'COMPLETED',  -- all done
                            'CANCELLED'   -- creator cancelled
                        ) DEFAULT 'DRAFT',

    is_delivery_available BOOLEAN DEFAULT FALSE,
    delivery_charge     DECIMAL(6,2) DEFAULT 0.00,
    
    drop_photo_url      VARCHAR(500) NULL,
    -- Photo of the food for this specific drop
    
    special_notes       TEXT NULL,
    -- "Please bring your own container", "Nut-free kitchen", etc.
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (creator_id) REFERENCES restaurants(restaurant_id)
);

CREATE INDEX idx_drops_creator ON food_drops(creator_id);
CREATE INDEX idx_drops_status ON food_drops(status);
CREATE INDEX idx_drops_date ON food_drops(drop_date);
CREATE INDEX idx_drops_cutoff ON food_drops(order_cutoff_time);

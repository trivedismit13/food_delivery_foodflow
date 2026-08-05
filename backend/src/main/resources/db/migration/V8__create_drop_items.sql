-- Which menu items are available in a specific drop
-- A drop can have 1 item (biryani only) or multiple items (full thali)

CREATE TABLE drop_items (
    drop_item_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    drop_id             BIGINT NOT NULL,
    item_id             BIGINT NOT NULL,
    -- References existing menu_items table
    
    quantity_available  INT NOT NULL,
    -- How many portions of this item in this drop
    
    quantity_ordered    INT DEFAULT 0,
    -- Atomic counter. Incremented when order placed.
    -- is_sold_out = quantity_ordered >= quantity_available
    
    drop_price          DECIMAL(10,2) NULL,
    -- If NULL, use the price from menu_items
    -- Allows creator to price differently for a drop
    -- Example: "Special drop price ₹180, regular price ₹250"

    UNIQUE KEY unique_drop_item (drop_id, item_id),
    -- Same item cannot appear twice in same drop

    FOREIGN KEY (drop_id) REFERENCES food_drops(drop_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

-- WHY track quantity at drop_item level, not just drop level:
-- A drop with Biryani (15 portions) and Kheer (15 portions)
-- needs independent stock tracking per item.
-- Biryani can sell out while Kheer is still available.

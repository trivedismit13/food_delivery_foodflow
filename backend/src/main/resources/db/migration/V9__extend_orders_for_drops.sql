-- Orders table already exists. We only ADD columns.
-- Existing orders remain valid. New columns are nullable.

ALTER TABLE orders
ADD COLUMN drop_id BIGINT NULL AFTER restaurant_id,
-- NULL for regular orders, set for drop pre-orders

ADD COLUMN order_type ENUM('REGULAR', 'DROP_PREORDER') DEFAULT 'REGULAR' AFTER drop_id,

ADD COLUMN pickup_time TIMESTAMP NULL AFTER order_type,
-- Chosen pickup slot within the drop's pickup window

ADD COLUMN special_instructions TEXT NULL AFTER pickup_time,
-- "No onions please", "Extra spicy"

ADD COLUMN is_delivery BOOLEAN DEFAULT FALSE AFTER special_instructions,

ADD COLUMN delivery_address TEXT NULL AFTER is_delivery;

ALTER TABLE orders
ADD FOREIGN KEY (drop_id) REFERENCES food_drops(drop_id);

-- Update existing orders to have REGULAR type
UPDATE orders SET order_type = 'REGULAR' WHERE drop_id IS NULL;

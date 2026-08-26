-- Remove delivery-specific fields from orders
-- All orders are now pickup orders only

ALTER TABLE orders
DROP COLUMN is_delivery;

ALTER TABLE orders
DROP COLUMN delivery_address;

-- Change pickup_time to plain text (VARCHAR) to match food_drops and UI
ALTER TABLE orders
MODIFY COLUMN pickup_time VARCHAR(100) NULL;

-- WHY: No delivery means no delivery address, no delivery flag needed
-- Simplifies the order record significantly

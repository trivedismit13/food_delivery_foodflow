-- First expand enum to include COMPLETED
ALTER TABLE orders MODIFY COLUMN status ENUM('PLACED','PREPARING','READY','ON_THE_WAY','DELIVERED','COMPLETED','CANCELLED') NOT NULL;

-- Convert existing legacy statuses to COMPLETED
UPDATE orders SET status = 'COMPLETED' WHERE status IN ('ON_THE_WAY', 'DELIVERED');

-- Now restrict enum to the final set
ALTER TABLE orders MODIFY COLUMN status ENUM('PLACED','PREPARING','READY','COMPLETED','CANCELLED') NOT NULL;

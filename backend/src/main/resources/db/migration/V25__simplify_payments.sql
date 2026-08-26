-- Simplify payment method and status to match Pay at Pickup model
-- No card, wallet, UPI — cash only
-- No delivery terminology

ALTER TABLE payments MODIFY COLUMN method VARCHAR(255);
ALTER TABLE payments MODIFY COLUMN status VARCHAR(255);

-- Update any existing records to CASH method
UPDATE payments SET method = 'CASH';

-- Update any SUCCESS → COLLECTED, FAILED → CANCELLED
UPDATE payments SET status = 'COLLECTED' WHERE status = 'SUCCESS';
UPDATE payments SET status = 'CANCELLED' WHERE status = 'FAILED';

ALTER TABLE payments 
MODIFY COLUMN method ENUM('CASH') NOT NULL DEFAULT 'CASH';

ALTER TABLE payments 
MODIFY COLUMN status ENUM('PENDING', 'COLLECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- WHY CASH only: FoodFlow is pickup-based. Payment happens in person.
-- No payment gateway needed. No CARD/WALLET/UPI complexity.
-- COLLECTED = customer paid when collecting food
-- PENDING = booked but not yet collected

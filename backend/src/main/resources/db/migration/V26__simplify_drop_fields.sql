-- Replace complex datetime pickup fields with plain text
-- Remove delivery-related fields
-- These fields add complexity without value in MVP

ALTER TABLE food_drops
ADD COLUMN pickup_time VARCHAR(100) NULL AFTER pickup_end_time;
-- Plain text: "Sunday 12 PM – 2 PM", "Saturday evening 5-7 PM"
-- Seller writes whatever makes sense for their context

-- Remove delivery fields (no delivery in MVP)
ALTER TABLE food_drops
DROP COLUMN is_delivery_available;

ALTER TABLE food_drops
DROP COLUMN delivery_charge;

-- NOTE: pickup_start_time and pickup_end_time columns
-- are kept in DB for Analytics compatibility but hidden in UI
-- Do NOT drop them — check if Analytics references them first

-- WHY plain text pickup_time:
-- Forcing sellers to use a datetime picker for pickup window
-- adds friction and is over-engineered for informal sellers
-- "Sunday 12-2 PM" is clearer than two datetime fields

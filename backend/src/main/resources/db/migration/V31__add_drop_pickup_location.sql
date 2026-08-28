ALTER TABLE food_drops
ADD COLUMN pickup_location VARCHAR(200) NULL AFTER order_cutoff_time;

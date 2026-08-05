-- Update existing seed data to reflect creator context
-- Transform the 15 existing restaurants into food creators

UPDATE restaurants SET 
    creator_type = 'HOME_BAKER',
    bio = 'Passionate home baker specialising in celebration cakes and artisan breads. Every order made fresh.',
    verification_level = 2,
    total_orders_completed = 47,
    accepts_delivery = FALSE,
    pickup_address = 'VIT Vellore, Near Main Gate'
WHERE restaurant_id = 1;

UPDATE restaurants SET
    creator_type = 'TIFFIN_SERVICE',
    bio = 'Homestyle South Indian meals. Sambar that reminds you of home.',
    verification_level = 1,
    total_orders_completed = 312,
    accepts_delivery = TRUE,
    delivery_radius_km = 3
WHERE restaurant_id = 2;

-- Continue for all 15 restaurants...
-- Mix of creator types, verification levels, and configurations

-- Seed 5 food drops
INSERT INTO food_drops 
(creator_id, title, description, drop_date, order_cutoff_time, 
 pickup_start_time, pickup_end_time, max_orders, current_orders, status) 
VALUES
(1, 'Sunday Biryani Drop', 
 'Slow-cooked Hyderabadi Biryani. Made with aged basmati and whole spices. Only 20 portions.',
 CURDATE() + INTERVAL 2 DAY,
 NOW() + INTERVAL 1 DAY,
 CURDATE() + INTERVAL 2 DAY + INTERVAL 12 HOUR,
 CURDATE() + INTERVAL 2 DAY + INTERVAL 14 HOUR,
 20, 12, 'OPEN'),

(2, 'Friday Cake Drop',
 'Three-layer chocolate truffle. Takes 2 days to set. Limited to 8 cakes.',
 CURDATE() + INTERVAL 3 DAY,
 NOW() + INTERVAL 2 DAY,
 CURDATE() + INTERVAL 3 DAY + INTERVAL 17 HOUR,
 CURDATE() + INTERVAL 3 DAY + INTERVAL 19 HOUR,
 8, 3, 'OPEN'),

(3, 'Weekend Thali Special',
 'Full Gujarati thali — 12 items. The kind your grandmother makes.',
 CURDATE() + INTERVAL 4 DAY,
 NOW() + INTERVAL 3 DAY,
 CURDATE() + INTERVAL 4 DAY + INTERVAL 13 HOUR,
 CURDATE() + INTERVAL 4 DAY + INTERVAL 15 HOUR,
 25, 0, 'ANNOUNCED'),

(4, 'Festival Mithai Box',
 'Assorted handmade sweets. Kaju katli, besan ladoo, chocolate barfi. 500g box.',
 CURDATE() + INTERVAL 5 DAY,
 NOW() + INTERVAL 4 DAY,
 NULL, NULL,
 30, 18, 'OPEN'),

(5, 'Monday Meal Prep Drop',
 '5-day tiffin subscription. Healthy homestyle lunch for the week.',
 CURDATE() + INTERVAL 1 DAY,
 NOW() + INTERVAL 6 HOUR,
 CURDATE() + INTERVAL 1 DAY + INTERVAL 9 HOUR,
 CURDATE() + INTERVAL 1 DAY + INTERVAL 10 HOUR,
 15, 15, 'CUTOFF');

-- Seed drop_items for each drop
INSERT INTO drop_items (drop_id, item_id, quantity_available, quantity_ordered) VALUES
(1, 2, 20, 12),  -- Chicken Biryani in Sunday drop
(2, 14, 8, 3),   -- item in Friday cake drop  
(3, 5, 25, 0),   -- Masala Dosa in thali drop
(3, 6, 25, 0),   -- Idli Sambar in thali drop
(4, 1, 30, 18);  -- item in festival drop

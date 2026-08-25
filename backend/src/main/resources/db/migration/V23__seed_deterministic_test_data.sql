-- V23__seed_deterministic_test_data.sql

-- 1. Clean up existing dummy drops to prevent conflicts
DELETE FROM payments WHERE order_id IN (SELECT order_id FROM orders WHERE drop_id IS NOT NULL);
DELETE FROM order_items WHERE order_id IN (SELECT order_id FROM orders WHERE drop_id IS NOT NULL);
DELETE FROM orders WHERE drop_id IS NOT NULL;
DELETE FROM drop_items;
DELETE FROM food_drops;

-- Delete the test users/restaurants if they exist so we can cleanly insert them
DELETE FROM menu_items WHERE restaurant_id = 99991;
DELETE FROM restaurants WHERE restaurant_id = 99991;
DELETE FROM users WHERE user_id IN (99991, 99992);

-- Insert deterministic Creator
INSERT INTO users (user_id, name, email, phone, password, role) 
VALUES (99991, 'Test Creator', 'creator@test.com', '9999999991', 'password', 'OWNER');

-- Insert deterministic Customer
INSERT INTO users (user_id, name, email, phone, password, role) 
VALUES (99992, 'Test Customer', 'customer@test.com', '9999999992', 'password', 'CUSTOMER');

-- Insert deterministic Restaurant (Creator Profile)
INSERT INTO restaurants (restaurant_id, owner_id, name, city, cuisine, creator_type, is_open) 
VALUES (99991, 99991, 'Test Kitchen', 'Test City', 'Test Cuisine', 'HOME_BAKER', TRUE);

-- Insert Menu Items for this Creator
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty) VALUES
(99991, 99991, 'Test Biryani', 'Delicious Test Biryani', 250.00, FALSE, 'Main Course', 100),
(99992, 99991, 'Test Paneer', 'Delicious Test Paneer', 200.00, TRUE, 'Main Course', 100);

-- Insert Drops in every possible state

-- 1. ANNOUNCED (in the future)
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99901, 99991, 'Announced Drop', 'Future drop', DATE_ADD(CURDATE(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 96 HOUR), DATE_ADD(NOW(), INTERVAL 120 HOUR), DATE_ADD(NOW(), INTERVAL 122 HOUR), 20, 0, 'ANNOUNCED');

-- 2. OPEN (Cutoff in 4 hours)
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99902, 99991, 'Open Drop - 4hr Cutoff', 'Cutoff in 4 hours', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 24 HOUR), DATE_ADD(NOW(), INTERVAL 26 HOUR), 20, 5, 'OPEN');

-- 3. OPEN (Cutoff in 1 hour)
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99903, 99991, 'Open Drop - 1hr Cutoff', 'Cutoff in 1 hour', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 HOUR), DATE_ADD(NOW(), INTERVAL 24 HOUR), DATE_ADD(NOW(), INTERVAL 26 HOUR), 20, 5, 'OPEN');

-- 4. OPEN (Cutoff in 5 minutes)
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99904, 99991, 'Open Drop - 5min Cutoff', 'Cutoff in 5 minutes', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 5 MINUTE), DATE_ADD(NOW(), INTERVAL 24 HOUR), DATE_ADD(NOW(), INTERVAL 26 HOUR), 20, 5, 'OPEN');

-- 5. CUTOFF (Cutoff passed, not ready)
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99905, 99991, 'Cutoff Drop', 'Cutoff passed', CURDATE(), DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 4 HOUR), 20, 15, 'CUTOFF');

-- 6. READY (Pickup time started)
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99906, 99991, 'Ready Drop', 'Pickup time started', CURDATE(), DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_ADD(NOW(), INTERVAL 1 HOUR), 20, 20, 'READY');

-- 7. COMPLETED (Pickup time ended)
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99907, 99991, 'Completed Drop', 'Pickup time ended', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 28 HOUR), DATE_SUB(NOW(), INTERVAL 25 HOUR), DATE_SUB(NOW(), INTERVAL 24 HOUR), 20, 20, 'COMPLETED');

-- 8. CANCELLED
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99908, 99991, 'Cancelled Drop', 'Cancelled', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 24 HOUR), DATE_ADD(NOW(), INTERVAL 26 HOUR), 20, 0, 'CANCELLED');

-- 9. OPEN but SOLD OUT (Available slots = 0)
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_start_time, pickup_end_time, max_orders, current_orders, status)
VALUES (99909, 99991, 'Sold Out Drop', 'Sold out completely', DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 24 HOUR), DATE_ADD(NOW(), INTERVAL 26 HOUR), 20, 20, 'OPEN');

-- Add Drop Items for these drops
INSERT INTO drop_items (drop_id, item_id, quantity_available, quantity_ordered)
VALUES
(99901, 99991, 20, 0),
(99902, 99991, 20, 5),
(99903, 99991, 20, 5),
(99904, 99991, 20, 5),
(99905, 99991, 20, 15),
(99906, 99991, 20, 20),
(99907, 99991, 20, 20),
(99908, 99991, 20, 0),
(99909, 99991, 20, 20);

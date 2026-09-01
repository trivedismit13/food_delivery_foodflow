CREATE TABLE creator_follows (
    follow_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    follower_id     BIGINT NOT NULL,
    creator_id      BIGINT NOT NULL,
    followed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_follow (follower_id, creator_id),
    -- Can't follow same creator twice

    FOREIGN KEY (follower_id) REFERENCES users(user_id),
    FOREIGN KEY (creator_id) REFERENCES restaurants(restaurant_id)
);

CREATE INDEX idx_follows_creator ON creator_follows(creator_id);
CREATE INDEX idx_follows_follower ON creator_follows(follower_id);
CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    
    type            ENUM(
                        'DROP_ANNOUNCED',    -- creator you follow announced a drop
                        'DROP_OPEN',         -- drop you were waiting for is now accepting orders
                        'DROP_CLOSING_SOON', -- 1 hour before cutoff
                        'ORDER_CONFIRMED',   -- your pre-order was confirmed
                        'ORDER_READY',       -- your food is ready for collection
                        'ORDER_CANCELLED',   -- drop was cancelled
                        'NEW_FOLLOWER',      -- someone followed your creator profile
                        'LOW_STOCK'          -- item in your drop is running low (for creators)
                    ),
    
    title           VARCHAR(200) NOT NULL,
    message         TEXT NOT NULL,
    
    reference_type  ENUM('DROP', 'ORDER', 'USER') NULL,
    reference_id    BIGINT NULL,
    -- Polymorphic reference: drop_id, order_id, or user_id
    -- Used for deep-linking to the relevant page
    
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
-- Composite index for "get all unread notifications for user" query
-- Reels already exist. Connect them to drops optionally.
-- A reel can now be "announcing" a specific drop.

ALTER TABLE reels
ADD COLUMN drop_id BIGINT NULL AFTER restaurant_id;
-- If set, this reel is an announcement for that drop
-- Customers can tap the reel to go directly to the drop

ALTER TABLE reels
ADD FOREIGN KEY (drop_id) REFERENCES food_drops(drop_id);

CREATE INDEX idx_reels_drop ON reels(drop_id);
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
 'Full Gujarati thali â€” 12 items. The kind your grandmother makes.',
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
ALTER TABLE drop_items
ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE food_drops
ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE orders ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE restaurants ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE users ADD COLUMN version BIGINT DEFAULT 0;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
ALTER TABLE orders MODIFY COLUMN status ENUM('PLACED','PREPARING','READY','ON_THE_WAY','DELIVERED','CANCELLED') NOT NULL;
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER','OWNER','ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
    restaurant_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(20),
    cuisine VARCHAR(50) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

CREATE TABLE menu_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_veg BOOLEAN NOT NULL,
    category VARCHAR(50) NOT NULL,
    available_qty INT NOT NULL DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    status ENUM('PLACED','PREPARING','ON_THE_WAY','DELIVERED','CANCELLED') NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

CREATE TABLE order_items (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_each DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    method ENUM('CARD','WALLET','COD','UPI') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('SUCCESS','FAILED','PENDING') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE ratings (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    rating_value DECIMAL(2,1) NOT NULL CHECK (rating_value BETWEEN 1.0 AND 5.0),
    food_quality_rating DECIMAL(2,1),
    delivery_rating DECIMAL(2,1),
    packaging_rating DECIMAL(2,1),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id),
    UNIQUE KEY unique_user_restaurant (user_id, restaurant_id)
);

CREATE TABLE reels (
    reel_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);
CREATE TABLE cities (
  city_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  city_name VARCHAR(200) NOT NULL,
  district VARCHAR(200),
  state VARCHAR(200) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  latitude DOUBLE,
  longitude DOUBLE,
  population BIGINT,
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE restaurants
ADD COLUMN city_id BIGINT,
ADD COLUMN latitude DOUBLE,
ADD COLUMN longitude DOUBLE;

ALTER TABLE restaurants
ADD CONSTRAINT fk_restaurant_city
FOREIGN KEY (city_id) REFERENCES cities(city_id);
ALTER TABLE food_drops
MODIFY COLUMN drop_photo_url LONGTEXT NULL;
ALTER TABLE notifications ADD COLUMN event_key VARCHAR(255) UNIQUE;
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
-- Update the ENUM on users table to replace OWNER with SELLER
-- MySQL requires the new value to exist before updating

ALTER TABLE users 
MODIFY COLUMN role ENUM('CUSTOMER', 'OWNER', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- Update any existing OWNER values to SELLER
UPDATE users SET role = 'SELLER' WHERE role = 'OWNER';

-- Remove OWNER from the ENUM
ALTER TABLE users 
MODIFY COLUMN role ENUM('CUSTOMER', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';
-- Simplify payment method and status to match Pay at Pickup model
-- No card, wallet, UPI â€” cash only
-- No delivery terminology

ALTER TABLE payments MODIFY COLUMN method VARCHAR(255);
ALTER TABLE payments MODIFY COLUMN status VARCHAR(255);

-- Update any existing records to CASH method
UPDATE payments SET method = 'CASH';

-- Update any SUCCESS â†’ COLLECTED, FAILED â†’ CANCELLED
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
-- Replace complex datetime pickup fields with plain text
-- Remove delivery-related fields
-- These fields add complexity without value in MVP

ALTER TABLE food_drops
ADD COLUMN pickup_time VARCHAR(100) NULL AFTER pickup_end_time;
-- Plain text: "Sunday 12 PM â€“ 2 PM", "Saturday evening 5-7 PM"
-- Seller writes whatever makes sense for their context

-- Remove delivery fields (no delivery in MVP)
ALTER TABLE food_drops
DROP COLUMN is_delivery_available;

ALTER TABLE food_drops
DROP COLUMN delivery_charge;

-- NOTE: pickup_start_time and pickup_end_time columns
-- are kept in DB for Analytics compatibility but hidden in UI
-- Do NOT drop them â€” check if Analytics references them first

-- WHY plain text pickup_time:
-- Forcing sellers to use a datetime picker for pickup window
-- adds friction and is over-engineered for informal sellers
-- "Sunday 12-2 PM" is clearer than two datetime fields
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
-- Remove Aadhaar storage completely
-- Simplify verification to phone verified (L1) and food credentials (L2)

ALTER TABLE creator_verifications
DROP COLUMN aadhaar_verified;

-- Rename columns for clarity
ALTER TABLE creator_verifications
ADD COLUMN phone_otp_verified BOOLEAN DEFAULT FALSE;

-- Keep these columns (they are still needed):
-- food_licence_number
-- food_licence_url
-- kitchen_photo_url_1
-- kitchen_photo_url_2
-- current_level
-- level_updated_at
-- rejection_reason (keep for admin use)

-- Remove physical inspection columns (L3 is future scope)
ALTER TABLE creator_verifications
DROP COLUMN inspection_passed;

ALTER TABLE creator_verifications
DROP COLUMN inspection_date;

ALTER TABLE creator_verifications
DROP COLUMN inspection_notes;

ALTER TABLE creator_verifications
DROP FOREIGN KEY creator_verifications_ibfk_2;

ALTER TABLE creator_verifications
DROP COLUMN inspected_by;

-- WHY: No raw Aadhaar storage in MVP
-- L1 verified = phone OTP confirmed, profile completed
-- L2 verified = FSSAI info submitted + admin approved
-- L3 = future, don't build the columns yet
-- Remove drop_id FK from reels (reels are general content, not drop-specific)
-- Remove view_count (no tracking infrastructure in MVP)

-- Remove FK constraint first
ALTER TABLE reels
DROP FOREIGN KEY reels_ibfk_2;

ALTER TABLE reels
DROP INDEX idx_reels_drop;

ALTER TABLE reels
DROP COLUMN drop_id;

ALTER TABLE reels
DROP COLUMN view_count;

-- What remains in reels:
-- reel_id (PK)
-- restaurant_id / seller_id (FK to restaurants/sellers)
-- title
-- media_url
-- created_at

-- WHY: Reels are about building seller identity, not advertising specific drops
-- A seller should freely post content without it needing to be linked to a drop
-- view_count requires increment logic and race conditions â€” not worth it in MVP
-- Insert Users (2 owners, 3 admins, 25 customers)
INSERT INTO users (name, email, phone, password, role) VALUES 
('Alice Owner', 'alice@owner.com', '1234567890', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'OWNER'),
('Bob Owner', 'bob@owner.com', '1234567891', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'OWNER'),
('Admin One', 'admin1@admin.com', '1234567892', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'ADMIN'),
('Admin Two', 'admin2@admin.com', '1234567893', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'ADMIN'),
('Admin Three', 'admin3@admin.com', '1234567894', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'ADMIN'),
('John Doe', 'john@user.com', '9876543210', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Jane Smith', 'jane@user.com', '9876543211', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Mike Johnson', 'mike@user.com', '9876543212', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Emily Davis', 'emily@user.com', '9876543213', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('David Wilson', 'david@user.com', '9876543214', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Sarah Brown', 'sarah@user.com', '9876543215', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Chris Taylor', 'chris@user.com', '9876543216', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Jessica Anderson', 'jessica@user.com', '9876543217', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Matt Thomas', 'matt@user.com', '9876543218', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Ashley Jackson', 'ashley@user.com', '9876543219', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Kevin White', 'kevin@user.com', '9876543220', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Amanda Harris', 'amanda@user.com', '9876543221', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Brian Martin', 'brian@user.com', '9876543222', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Melissa Thompson', 'melissa@user.com', '9876543223', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Ryan Garcia', 'ryan@user.com', '9876543224', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Nicole Martinez', 'nicole@user.com', '9876543225', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Jason Robinson', 'jason@user.com', '9876543226', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Heather Clark', 'heather@user.com', '9876543227', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Gary Rodriguez', 'gary@user.com', '9876543228', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Amy Lewis', 'amy@user.com', '9876543229', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Justin Lee', 'justin@user.com', '9876543230', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Rachel Walker', 'rachel@user.com', '9876543231', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Scott Hall', 'scott@user.com', '9876543232', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Stephanie Allen', 'stephanie@user.com', '9876543233', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Brandon Young', 'brandon@user.com', '9876543234', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER');

-- Insert Restaurants
INSERT INTO restaurants (owner_id, name, city, pincode, cuisine) VALUES 
(1, 'Spicy Treats', 'New York', '10001', 'Indian'),
(1, 'Burger King', 'New York', '10002', 'American'),
(1, 'Pasta Palace', 'Chicago', '60001', 'Italian'),
(2, 'Sushi Zen', 'San Francisco', '94016', 'Japanese'),
(2, 'Taco Bell', 'Los Angeles', '90001', 'Mexican'),
(1, 'Curry House', 'Seattle', '98101', 'Indian'),
(2, 'Pizza Hut', 'New York', '10003', 'Italian'),
(1, 'Wok this Way', 'Chicago', '60002', 'Chinese'),
(2, 'BBQ Nation', 'Austin', '73301', 'American'),
(1, 'Dosa Diner', 'San Francisco', '94017', 'Indian'),
(2, 'Pho Real', 'Seattle', '98102', 'Vietnamese'),
(1, 'Salad Days', 'Los Angeles', '90002', 'Healthy'),
(2, 'Sweet Tooth', 'New York', '10004', 'Dessert'),
(1, 'Bento Box', 'Austin', '73302', 'Japanese'),
(2, 'Falafel Fix', 'Chicago', '60003', 'Middle Eastern'),
(1, 'Steakhouse Supreme', 'Dallas', '75001', 'American'),
(2, 'Dim Sum Delight', 'San Francisco', '94018', 'Chinese'),
(1, 'Greek Taverna', 'New York', '10005', 'Greek'),
(2, 'Vegan Vibes', 'Los Angeles', '90003', 'Healthy'),
(1, 'French Bistro', 'Chicago', '60004', 'French');

-- Insert Menu Items (100 items - 5 per restaurant)
INSERT INTO menu_items (restaurant_id, name, description, price, is_veg, category, available_qty) VALUES
(1, 'Chicken Biryani', 'Spicy chicken biryani', 15.99, false, 'Main Course', 50), (1, 'Paneer Tikka', 'Grilled cottage cheese', 12.99, true, 'Starter', 30), (1, 'Garlic Naan', 'Indian bread', 3.50, true, 'Bread', 150), (1, 'Dal Makhani', 'Creamy lentils', 11.50, true, 'Main Course', 40), (1, 'Gulab Jamun', 'Sweet dessert', 4.99, true, 'Dessert', 60),
(2, 'Whopper', 'Signature burger', 8.99, false, 'Burger', 100), (2, 'Fries', 'Crispy french fries', 3.99, true, 'Sides', 200), (2, 'Onion Rings', 'Fried onion rings', 4.50, true, 'Sides', 150), (2, 'Chicken Nuggets', '10 pc nuggets', 5.99, false, 'Sides', 120), (2, 'Vanilla Shake', 'Thick milkshake', 4.99, true, 'Drinks', 80),
(3, 'Margherita Pizza', 'Classic cheese pizza', 14.50, true, 'Pizza', 40), (3, 'Pasta Carbonara', 'Creamy pasta', 16.50, false, 'Pasta', 35), (3, 'Garlic Bread', 'Cheesy garlic bread', 5.50, true, 'Sides', 100), (3, 'Tiramisu', 'Coffee dessert', 7.50, true, 'Dessert', 30), (3, 'Caesar Salad', 'Fresh salad', 9.00, true, 'Salad', 45),
(4, 'Salmon Roll', 'Fresh salmon sushi', 12.00, false, 'Sushi', 60), (4, 'Miso Soup', 'Traditional soup', 4.50, true, 'Soup', 80), (4, 'Edamame', 'Steamed beans', 4.50, true, 'Starter', 90), (4, 'Spicy Tuna Roll', 'Tuna with spicy mayo', 13.50, false, 'Sushi', 50), (4, 'Green Tea Mochi', 'Ice cream', 5.00, true, 'Dessert', 40),
(5, 'Crunchwrap', 'Supreme crunchy wrap', 6.99, false, 'Wrap', 150), (5, 'Nachos', 'Cheesy nachos', 5.99, true, 'Sides', 120), (5, 'Soft Taco', 'Beef taco', 2.99, false, 'Taco', 200), (5, 'Quesadilla', 'Cheese quesadilla', 4.99, true, 'Sides', 100), (5, 'Churros', 'Fried dough pastry', 3.99, true, 'Dessert', 80),
(6, 'Butter Chicken', 'Creamy chicken curry', 17.99, false, 'Main Course', 45), (6, 'Garlic Naan', 'Indian bread', 3.50, true, 'Bread', 150), (6, 'Samosa', 'Potato stuffed pastry', 4.50, true, 'Starter', 100), (6, 'Chicken Tikka', 'Grilled chicken', 13.99, false, 'Starter', 60), (6, 'Mango Lassi', 'Yogurt drink', 4.00, true, 'Drinks', 80),
(7, 'Pepperoni Pizza', 'Meat lover pizza', 16.99, false, 'Pizza', 50), (7, 'Garlic Bread', 'Cheesy garlic bread', 5.50, true, 'Sides', 100), (7, 'Cheese Pizza', 'Classic cheese', 14.99, true, 'Pizza', 60), (7, 'Wings', 'Buffalo wings 8pc', 9.99, false, 'Sides', 80), (7, 'Coke', 'Can of coke', 2.00, true, 'Drinks', 200),
(8, 'Kung Pao Chicken', 'Spicy stir fry', 14.99, false, 'Main Course', 60), (8, 'Spring Rolls', 'Crispy rolls', 6.50, true, 'Starter', 80), (8, 'Fried Rice', 'Chicken fried rice', 11.99, false, 'Main Course', 70), (8, 'Wonton Soup', 'Pork wontons in broth', 7.50, false, 'Soup', 50), (8, 'Fortune Cookie', 'Sweet cookie', 1.00, true, 'Dessert', 300),
(9, 'Brisket', 'Slow smoked brisket', 22.00, false, 'Main Course', 30), (9, 'Coleslaw', 'Fresh cabbage slaw', 4.00, true, 'Sides', 70), (9, 'Ribs', 'Half rack of ribs', 18.50, false, 'Main Course', 40), (9, 'Mac and Cheese', 'Creamy macaroni', 6.50, true, 'Sides', 60), (9, 'Cornbread', 'Sweet cornbread', 3.50, true, 'Sides', 90),
(10, 'Masala Dosa', 'Crispy crepe', 10.99, true, 'Main Course', 80), (10, 'Idli', 'Steamed rice cakes', 6.99, true, 'Starter', 100), (10, 'Vada', 'Fried lentil donut', 5.99, true, 'Starter', 90), (10, 'Filter Coffee', 'South Indian coffee', 3.50, true, 'Drinks', 150), (10, 'Rava Dosa', 'Semolina crepe', 11.50, true, 'Main Course', 50),
(11, 'Beef Pho', 'Noodle soup', 13.50, false, 'Soup', 55), (11, 'Summer Rolls', 'Fresh rolls', 7.50, true, 'Starter', 65), (11, 'Chicken Banh Mi', 'Vietnamese sandwich', 8.50, false, 'Main Course', 45), (11, 'Vietnamese Coffee', 'Iced coffee with milk', 4.50, true, 'Drinks', 80), (11, 'Pork Chop Rice', 'Grilled pork over rice', 12.99, false, 'Main Course', 40),
(12, 'Caesar Salad', 'Classic salad', 9.99, true, 'Salad', 40), (12, 'Quinoa Bowl', 'Healthy bowl', 12.99, true, 'Main Course', 50), (12, 'Green Smoothie', 'Kale and spinach', 6.50, true, 'Drinks', 60), (12, 'Avocado Toast', 'Toast with avocado', 8.50, true, 'Main Course', 45), (12, 'Fruit Bowl', 'Mixed seasonal fruits', 7.00, true, 'Sides', 55),
(13, 'Cheesecake', 'NY style', 7.50, true, 'Dessert', 30), (13, 'Brownie', 'Fudge brownie', 5.50, true, 'Dessert', 40), (13, 'Chocolate Chip Cookie', 'Fresh baked cookie', 3.00, true, 'Dessert', 100), (13, 'Apple Pie', 'Slice of apple pie', 6.00, true, 'Dessert', 35), (13, 'Ice Cream Sundae', 'Vanilla with chocolate syrup', 6.50, true, 'Dessert', 50),
(14, 'Chicken Teriyaki', 'Sweet soy chicken', 15.50, false, 'Main Course', 45), (14, 'Edamame', 'Steamed beans', 4.50, true, 'Starter', 90), (14, 'Spicy Tuna Bowl', 'Tuna over rice', 14.50, false, 'Main Course', 40), (14, 'Gyoza', 'Pan fried dumplings', 7.50, false, 'Starter', 60), (14, 'Matcha Tea', 'Hot green tea', 3.50, true, 'Drinks', 100),
(15, 'Falafel Wrap', 'Veggie wrap', 9.50, true, 'Wrap', 60), (15, 'Hummus', 'Chickpea dip', 6.50, true, 'Sides', 80), (15, 'Chicken Shawarma', 'Roasted chicken wrap', 10.50, false, 'Wrap', 70), (15, 'Baba Ganoush', 'Eggplant dip', 7.00, true, 'Sides', 60), (15, 'Baklava', 'Sweet pastry', 4.50, true, 'Dessert', 90),
(16, 'Ribeye Steak', '12oz Ribeye', 35.00, false, 'Main Course', 25), (16, 'Mashed Potatoes', 'Creamy potatoes', 6.00, true, 'Sides', 60), (16, 'Asparagus', 'Grilled asparagus', 7.50, true, 'Sides', 40), (16, 'Filet Mignon', '8oz Filet', 40.00, false, 'Main Course', 20), (16, 'Cheesecake', 'NY style', 9.00, true, 'Dessert', 30),
(17, 'Pork Dumplings', 'Steamed dumplings', 8.50, false, 'Dim Sum', 80), (17, 'Shrimp Har Gow', 'Shrimp dumplings', 9.50, false, 'Dim Sum', 70), (17, 'BBQ Pork Buns', 'Steamed buns', 7.50, false, 'Dim Sum', 90), (17, 'Egg Tarts', 'Sweet tart', 5.50, true, 'Dessert', 60), (17, 'Jasmine Tea', 'Hot tea', 3.00, true, 'Drinks', 150),
(18, 'Gyros Plate', 'Lamb/Beef gyros', 14.50, false, 'Main Course', 50), (18, 'Greek Salad', 'Feta and olives', 9.50, true, 'Salad', 60), (18, 'Tzatziki', 'Yogurt dip with pita', 6.50, true, 'Sides', 70), (18, 'Souvlaki', 'Chicken skewers', 13.50, false, 'Main Course', 45), (18, 'Spanakopita', 'Spinach pie', 8.00, true, 'Starter', 55),
(19, 'Vegan Burger', 'Beyond meat patty', 13.99, true, 'Main Course', 60), (19, 'Sweet Potato Fries', 'Baked fries', 5.50, true, 'Sides', 80), (19, 'Tofu Scramble', 'Breakfast scramble', 11.00, true, 'Main Course', 50), (19, 'Kombucha', 'Probiotic drink', 4.50, true, 'Drinks', 100), (19, 'Vegan Brownie', 'Dairy free brownie', 4.00, true, 'Dessert', 70),
(20, 'Croissant', 'Butter croissant', 4.50, true, 'Bread', 80), (20, 'French Onion Soup', 'Classic soup', 8.50, false, 'Soup', 50), (20, 'Steak Frites', 'Steak and fries', 26.00, false, 'Main Course', 30), (20, 'Escargot', 'Snails in garlic butter', 12.50, false, 'Starter', 25), (20, 'CrÃ¨me BrÃ»lÃ©e', 'Custard dessert', 9.00, true, 'Dessert', 40);

-- Insert Orders (Generate ~200 orders across 6 months). 
-- This uses a CTE to generate dates, but for MySQL 8 compatibility we will just insert multiple blocks.
-- To save space in this file, we will construct 100 orders explicitly.
INSERT INTO orders (user_id, restaurant_id, status, total_amount, order_date) VALUES
(6, 1, 'DELIVERED', 32.48, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 170 DAY)),
(7, 2, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 165 DAY)),
(8, 3, 'DELIVERED', 31.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 160 DAY)),
(9, 4, 'DELIVERED', 16.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 155 DAY)),
(10, 5, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 150 DAY)),
(11, 6, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 145 DAY)),
(12, 7, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 140 DAY)),
(13, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 135 DAY)),
(14, 9, 'DELIVERED', 26.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 130 DAY)),
(15, 10, 'DELIVERED', 17.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 125 DAY)),
(16, 11, 'DELIVERED', 21.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 120 DAY)),
(17, 12, 'DELIVERED', 22.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 115 DAY)),
(18, 13, 'DELIVERED', 13.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 110 DAY)),
(19, 14, 'DELIVERED', 20.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 105 DAY)),
(20, 15, 'DELIVERED', 16.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 100 DAY)),
(21, 16, 'DELIVERED', 41.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 95 DAY)),
(22, 17, 'DELIVERED', 18.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 90 DAY)),
(23, 18, 'DELIVERED', 24.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 85 DAY)),
(24, 19, 'DELIVERED', 19.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 80 DAY)),
(25, 20, 'DELIVERED', 30.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 75 DAY)),
(26, 1, 'DELIVERED', 28.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 70 DAY)),
(27, 2, 'DELIVERED', 17.97, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 68 DAY)),
(28, 3, 'CANCELLED', 20.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 65 DAY)),
(29, 4, 'DELIVERED', 25.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 60 DAY)),
(30, 5, 'DELIVERED', 11.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 58 DAY)),
(6, 6, 'DELIVERED', 35.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 55 DAY)),
(7, 7, 'DELIVERED', 26.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 52 DAY)),
(8, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 50 DAY)),
(9, 9, 'DELIVERED', 40.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 48 DAY)),
(10, 10, 'DELIVERED', 17.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 45 DAY)),
(11, 11, 'DELIVERED', 21.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 42 DAY)),
(12, 12, 'DELIVERED', 22.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 40 DAY)),
(13, 13, 'CANCELLED', 13.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 38 DAY)),
(14, 14, 'DELIVERED', 20.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 35 DAY)),
(15, 15, 'DELIVERED', 16.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 32 DAY)),
(16, 16, 'DELIVERED', 75.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY)),
(17, 17, 'DELIVERED', 25.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 28 DAY)),
(18, 18, 'DELIVERED', 24.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 25 DAY)),
(19, 19, 'DELIVERED', 19.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 22 DAY)),
(20, 20, 'DELIVERED', 30.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 20 DAY)),
(21, 1, 'DELIVERED', 32.48, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 DAY)),
(22, 2, 'CANCELLED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 16 DAY)),
(23, 3, 'DELIVERED', 31.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 DAY)),
(24, 4, 'DELIVERED', 16.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 12 DAY)),
(25, 5, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY)),
(26, 6, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 DAY)),
(27, 7, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 DAY)),
(28, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 DAY)),
(29, 9, 'DELIVERED', 26.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(30, 10, 'DELIVERED', 17.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(6, 11, 'PREPARING', 21.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)),
(7, 12, 'ON_THE_WAY', 22.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE)),
(8, 13, 'PLACED', 13.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)),
(9, 1, 'DELIVERED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(10, 1, 'DELIVERED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(11, 1, 'CANCELLED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(12, 1, 'DELIVERED', 28.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(13, 1, 'DELIVERED', 32.48, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(14, 1, 'DELIVERED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 DAY)),
(15, 1, 'CANCELLED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 DAY)),
(16, 2, 'DELIVERED', 8.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(17, 2, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(18, 2, 'DELIVERED', 17.97, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(19, 2, 'DELIVERED', 8.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(20, 2, 'DELIVERED', 13.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(21, 3, 'DELIVERED', 14.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(22, 3, 'DELIVERED', 16.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(23, 3, 'DELIVERED', 31.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(24, 3, 'DELIVERED', 14.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(25, 3, 'DELIVERED', 20.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(26, 4, 'DELIVERED', 12.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(27, 4, 'DELIVERED', 16.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(28, 4, 'DELIVERED', 25.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(29, 4, 'DELIVERED', 12.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(30, 4, 'DELIVERED', 17.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(6, 5, 'DELIVERED', 6.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(7, 5, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(8, 5, 'DELIVERED', 11.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(9, 5, 'DELIVERED', 6.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(10, 5, 'DELIVERED', 9.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(11, 6, 'DELIVERED', 17.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(12, 6, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(13, 6, 'DELIVERED', 35.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(14, 6, 'DELIVERED', 17.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(15, 6, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(16, 7, 'DELIVERED', 16.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(17, 7, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(18, 7, 'DELIVERED', 26.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(19, 7, 'DELIVERED', 16.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(20, 7, 'DELIVERED', 18.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(21, 8, 'DELIVERED', 14.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(22, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(23, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(24, 8, 'DELIVERED', 14.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(25, 8, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(26, 9, 'DELIVERED', 22.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(27, 9, 'DELIVERED', 26.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(28, 9, 'DELIVERED', 40.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(29, 9, 'DELIVERED', 22.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(30, 9, 'DELIVERED', 28.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY));


-- Insert Order Items (Corresponding to the orders above)
-- We will just insert 1-2 items per order to keep it simple but realistic.
-- Since order IDs are 1 to 100 in the above insert.
INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 1, 1, 15.99 FROM orders WHERE restaurant_id = 1;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 6, 1, 8.99 FROM orders WHERE restaurant_id = 2;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 11, 1, 14.50 FROM orders WHERE restaurant_id = 3;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 16, 1, 12.00 FROM orders WHERE restaurant_id = 4;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 21, 1, 6.99 FROM orders WHERE restaurant_id = 5;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 26, 1, 17.99 FROM orders WHERE restaurant_id = 6;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 31, 1, 16.99 FROM orders WHERE restaurant_id = 7;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 36, 1, 14.99 FROM orders WHERE restaurant_id = 8;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 41, 1, 22.00 FROM orders WHERE restaurant_id = 9;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 46, 1, 10.99 FROM orders WHERE restaurant_id = 10;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 51, 1, 13.50 FROM orders WHERE restaurant_id = 11;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 56, 1, 9.99 FROM orders WHERE restaurant_id = 12;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 61, 1, 7.50 FROM orders WHERE restaurant_id = 13;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 66, 1, 15.50 FROM orders WHERE restaurant_id = 14;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 71, 1, 9.50 FROM orders WHERE restaurant_id = 15;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 76, 1, 35.00 FROM orders WHERE restaurant_id = 16;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 81, 1, 8.50 FROM orders WHERE restaurant_id = 17;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 86, 1, 14.50 FROM orders WHERE restaurant_id = 18;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 91, 1, 13.99 FROM orders WHERE restaurant_id = 19;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 96, 1, 4.50 FROM orders WHERE restaurant_id = 20;


-- Insert Payments for all orders
INSERT INTO payments (order_id, method, amount, status, payment_date)
SELECT order_id, 'CARD', total_amount, IF(status = 'CANCELLED', 'FAILED', 'SUCCESS'), order_date FROM orders;


-- Insert Ratings (Create ratings for most delivered orders)
INSERT INTO ratings (user_id, restaurant_id, rating_value, food_quality_rating, delivery_rating, packaging_rating, review_text)
SELECT user_id, restaurant_id, 
       ROUND(RAND() * 2 + 3, 1), -- random rating between 3 and 5
       ROUND(RAND() * 1 + 4, 1), -- food quality 4-5
       ROUND(RAND() * 2 + 2, 1), -- delivery 2-4
       ROUND(RAND() * 2 + 3, 1), -- packaging 3-5
       'Decent experience overall'
FROM orders WHERE status = 'DELIVERED' LIMIT 50;

-- Specifically update some ratings to have poor delivery scores to trigger the AI insight for Restaurant 1 (Spicy Treats)
UPDATE ratings SET rating_value = 3.0, food_quality_rating = 4.8, delivery_rating = 1.5, packaging_rating = 3.5, review_text = 'Food was amazing but took 2 hours to deliver and was cold.' WHERE user_id = 21 AND restaurant_id = 1;
UPDATE ratings SET rating_value = 2.5, food_quality_rating = 4.5, delivery_rating = 1.0, packaging_rating = 3.0, review_text = 'Delicious biryani but delivery driver was rude and late.' WHERE user_id = 26 AND restaurant_id = 1;


-- Insert Reels
INSERT INTO reels (restaurant_id, title, media_url, view_count) VALUES
(1, 'Making Biryani', 'https://s3.foodflow.com/reels/1', 1500), (1, 'Behind the Scenes', 'https://s3.foodflow.com/reels/21', 2500),
(2, 'Flipping Burgers', 'https://s3.foodflow.com/reels/2', 800), (2, 'Secret Sauce', 'https://s3.foodflow.com/reels/22', 1200),
(3, 'Pizza Toss', 'https://s3.foodflow.com/reels/3', 2200), (3, 'Fresh Dough', 'https://s3.foodflow.com/reels/23', 3400),
(4, 'Sushi Art', 'https://s3.foodflow.com/reels/4', 3100), (4, 'Slicing Salmon', 'https://s3.foodflow.com/reels/24', 4100),
(5, 'Crunchwrap Time', 'https://s3.foodflow.com/reels/5', 500), (5, 'Taco Tuesday', 'https://s3.foodflow.com/reels/25', 1500),
(6, 'Butter Chicken Simmer', 'https://s3.foodflow.com/reels/6', 1800), (6, 'Naan in Tandoor', 'https://s3.foodflow.com/reels/26', 2800),
(7, 'Cheese Pull', 'https://s3.foodflow.com/reels/7', 4500), (7, 'Delivery Prep', 'https://s3.foodflow.com/reels/27', 3500),
(8, 'Wok Fire', 'https://s3.foodflow.com/reels/8', 2900), (8, 'Dumpling Fold', 'https://s3.foodflow.com/reels/28', 1900),
(9, 'Smoking Brisket', 'https://s3.foodflow.com/reels/9', 5500), (9, 'BBQ Sauce Pour', 'https://s3.foodflow.com/reels/29', 6500),
(10, 'Dosa Flip', 'https://s3.foodflow.com/reels/10', 1200), (10, 'Idli Steam', 'https://s3.foodflow.com/reels/30', 2200);
-- Remove location infrastructure columns
-- Keep plain text city for display only

-- restaurants table: remove structured location columns
ALTER TABLE restaurants
DROP COLUMN delivery_radius_km;

ALTER TABLE restaurants
DROP COLUMN accepts_delivery;

-- Keep: city (plain text, display only)
-- Keep: pickup_address (plain text, display only)
-- These two are just informational text, not filtering mechanisms

-- Remove latitude/longitude if they were added
ALTER TABLE restaurants
DROP COLUMN latitude;

ALTER TABLE restaurants
DROP COLUMN longitude;

-- If city_id FK column exists (from cities table design):
ALTER TABLE restaurants
DROP FOREIGN KEY fk_restaurant_city;

ALTER TABLE restaurants
DROP COLUMN city_id;

-- Drop cities table entirely
-- Analytics does not reference this table anymore, only restaurants.city
DROP TABLE cities;

-- WHY: Location filtering is completely removed from this MVP
-- "city" on seller profile is just text that tells customers where they are
-- No radius, no geocoding, no GPS, no distance calculations
ALTER TABLE food_drops
ADD COLUMN pickup_location VARCHAR(200) NULL AFTER order_cutoff_time;
-- First expand enum to include COMPLETED
ALTER TABLE orders MODIFY COLUMN status ENUM('PLACED','PREPARING','READY','ON_THE_WAY','DELIVERED','COMPLETED','CANCELLED') NOT NULL;

-- Convert existing legacy statuses to COMPLETED
UPDATE orders SET status = 'COMPLETED' WHERE status IN ('ON_THE_WAY', 'DELIVERED');

-- Now restrict enum to the final set
ALTER TABLE orders MODIFY COLUMN status ENUM('PLACED','PREPARING','READY','COMPLETED','CANCELLED') NOT NULL;
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE UNIQUE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_ratings_restaurant ON ratings(restaurant_id);
-- Repurpose the restaurants table for food creators
-- All existing columns stay, we only ADD new ones

ALTER TABLE restaurants 
ADD COLUMN creator_type ENUM(
    'HOME_BAKER',
    'TIFFIN_SERVICE', 
    'CAMPUS_SELLER',
    'WEEKEND_CHEF',
    'CLOUD_KITCHEN',
    'SPECIALTY_DESSERTS',
    'HEALTHY_MEALS'
) DEFAULT 'HOME_BAKER' AFTER cuisine,

ADD COLUMN bio TEXT AFTER creator_type,

ADD COLUMN instagram_handle VARCHAR(100) NULL AFTER bio,

ADD COLUMN pickup_address TEXT NULL AFTER instagram_handle,
-- Full address where customers collect orders
-- NULL means delivery only or not yet set

ADD COLUMN accepts_delivery BOOLEAN DEFAULT FALSE AFTER pickup_address,

ADD COLUMN delivery_radius_km INT DEFAULT 3 AFTER accepts_delivery,

ADD COLUMN verification_level TINYINT DEFAULT 0 AFTER delivery_radius_km,
-- 0 = unverified, 1 = identity verified, 2 = food licence, 3 = fully inspected

ADD COLUMN total_orders_completed INT DEFAULT 0 AFTER verification_level,
-- denormalized counter, updated on order completion, avoids COUNT(*) every time

ADD COLUMN follower_count INT DEFAULT 0 AFTER total_orders_completed,
-- denormalized counter

ADD COLUMN avg_rating DECIMAL(3,2) DEFAULT 0.00 AFTER follower_count,
-- denormalized, updated when rating submitted

ADD COLUMN is_accepting_orders BOOLEAN DEFAULT TRUE AFTER avg_rating,
-- creator can pause orders anytime

ADD COLUMN announcement TEXT NULL AFTER is_accepting_orders;
-- "Taking a break this week, back on Sunday!"
-- Simple free-text pinned message on their profile
CREATE TABLE creator_verifications (
    verification_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    creator_id          BIGINT NOT NULL UNIQUE,
    -- UNIQUE: one verification record per creator

    -- Level 1: Identity
    aadhaar_verified    BOOLEAN DEFAULT FALSE,
    phone_verified      BOOLEAN DEFAULT FALSE,
    
    -- Level 2: Food Business
    food_licence_number VARCHAR(100) NULL,
    food_licence_url    VARCHAR(500) NULL,
    -- URL to uploaded document (S3 or local for demo)
    kitchen_photo_url_1 VARCHAR(500) NULL,
    kitchen_photo_url_2 VARCHAR(500) NULL,
    ingredient_declaration TEXT NULL,
    -- Free text: "I use Amul butter, fresh vegetables from local market"
    
    -- Level 3: Physical Inspection
    inspection_passed   BOOLEAN DEFAULT FALSE,
    inspection_date     DATE NULL,
    inspection_notes    TEXT NULL,
    inspected_by        BIGINT NULL,
    -- FK to admin user who conducted inspection

    -- Platform records
    current_level       TINYINT DEFAULT 0,
    level_updated_at    TIMESTAMP NULL,
    rejection_reason    TEXT NULL,
    -- If admin rejects, reason is stored here
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (creator_id) REFERENCES restaurants(restaurant_id),
    FOREIGN KEY (inspected_by) REFERENCES users(user_id)
);

-- WHY this is a separate table and not columns on restaurants:
-- Verification data is sensitive and large (document URLs, notes)
-- It's accessed rarely compared to the main creator profile
-- Separating it follows Single Responsibility at the data model level
-- A restaurant record without verification data still makes complete sense
-- A DROP is a limited-time, limited-quantity food release
-- Example: "Sunday Biryani Drop â€” 20 portions, order by Saturday 8PM, 
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
    -- Example: "Special drop price â‚¹180, regular price â‚¹250"

    UNIQUE KEY unique_drop_item (drop_id, item_id),
    -- Same item cannot appear twice in same drop

    FOREIGN KEY (drop_id) REFERENCES food_drops(drop_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

-- WHY track quantity at drop_item level, not just drop level:
-- A drop with Biryani (15 portions) and Kheer (15 portions)
-- needs independent stock tracking per item.
-- Biryani can sell out while Kheer is still available.
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

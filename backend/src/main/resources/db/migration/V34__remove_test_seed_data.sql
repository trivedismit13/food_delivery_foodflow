-- V34__remove_test_seed_data.sql
-- Removes the deterministic test users, creator, and drops inserted by V23.
-- These records (IDs 99901-99909 for drops, 99991-99992 for users/restaurant/menu items)
-- were intended for local development QA only and must not exist in production environments.
-- Fly cleanly: if these records don't exist (e.g. already cleaned up manually), no error.

-- 1. Remove test drop items first (FK -> drop_items)
DELETE FROM drop_items WHERE drop_id IN (99901,99902,99903,99904,99905,99906,99907,99908,99909);

-- 2. Remove payments for any orders associated with the test restaurant (FK -> payments -> orders)
DELETE FROM payments WHERE order_id IN (
    SELECT order_id FROM orders WHERE restaurant_id = 99991
);

-- 3. Remove order items for those orders (FK -> order_items -> orders)
DELETE FROM order_items WHERE order_id IN (
    SELECT order_id FROM orders WHERE restaurant_id = 99991
);

-- 4. Remove test orders
DELETE FROM orders WHERE restaurant_id = 99991;

-- 5. Remove notifications referencing the test users
DELETE FROM notifications WHERE user_id IN (99991, 99992);

-- 6. Remove creator_follows for the test creator / customer
DELETE FROM creator_follows WHERE follower_id IN (99991, 99992)
    OR creator_id = 99991;

-- 7. Remove any creator_verifications for the test creator
DELETE FROM creator_verifications WHERE creator_id = 99991;

-- 8. Remove test food drops
DELETE FROM food_drops WHERE drop_id IN (99901,99902,99903,99904,99905,99906,99907,99908,99909);

-- 9. Remove test menu items
DELETE FROM menu_items WHERE restaurant_id = 99991;

-- 10. Remove the test restaurant (creator profile)
DELETE FROM restaurants WHERE restaurant_id = 99991;

-- 11. Remove the test users
DELETE FROM users WHERE user_id IN (99991, 99992);

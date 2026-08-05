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

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

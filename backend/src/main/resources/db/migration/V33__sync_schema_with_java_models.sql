-- Sync database schema with Java JPA models
-- Fixes mismatches where columns were left over after simplification or nullable constraints differ

-- 1. Drop delivery_rating from ratings (delivery was removed in V27)
ALTER TABLE ratings
DROP COLUMN delivery_rating;

-- 2. Drop unused verification columns left over from V28 simplify verification
ALTER TABLE creator_verifications
DROP COLUMN phone_verified;

ALTER TABLE creator_verifications
DROP COLUMN ingredient_declaration;

-- 3. Make users.is_active NOT NULL to match Java entity constraint
ALTER TABLE users
MODIFY COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

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

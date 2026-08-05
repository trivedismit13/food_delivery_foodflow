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

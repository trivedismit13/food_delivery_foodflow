-- Update the ENUM on users table to replace OWNER with SELLER
-- MySQL requires the new value to exist before updating

ALTER TABLE users 
MODIFY COLUMN role ENUM('CUSTOMER', 'OWNER', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';

-- Update any existing OWNER values to SELLER
UPDATE users SET role = 'SELLER' WHERE role = 'OWNER';

-- Remove OWNER from the ENUM
ALTER TABLE users 
MODIFY COLUMN role ENUM('CUSTOMER', 'SELLER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';

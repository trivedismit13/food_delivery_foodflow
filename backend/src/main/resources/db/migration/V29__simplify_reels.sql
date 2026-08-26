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
-- view_count requires increment logic and race conditions — not worth it in MVP

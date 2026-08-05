-- Reels already exist. Connect them to drops optionally.
-- A reel can now be "announcing" a specific drop.

ALTER TABLE reels
ADD COLUMN drop_id BIGINT NULL AFTER restaurant_id;
-- If set, this reel is an announcement for that drop
-- Customers can tap the reel to go directly to the drop

ALTER TABLE reels
ADD FOREIGN KEY (drop_id) REFERENCES food_drops(drop_id);

CREATE INDEX idx_reels_drop ON reels(drop_id);

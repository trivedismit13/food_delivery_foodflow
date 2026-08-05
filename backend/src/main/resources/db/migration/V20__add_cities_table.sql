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

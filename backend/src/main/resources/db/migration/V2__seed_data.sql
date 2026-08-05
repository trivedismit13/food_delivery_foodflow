-- Insert Users (2 owners, 3 admins, 25 customers)
INSERT INTO users (name, email, phone, password, role) VALUES 
('Alice Owner', 'alice@owner.com', '1234567890', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'OWNER'),
('Bob Owner', 'bob@owner.com', '1234567891', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'OWNER'),
('Admin One', 'admin1@admin.com', '1234567892', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'ADMIN'),
('Admin Two', 'admin2@admin.com', '1234567893', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'ADMIN'),
('Admin Three', 'admin3@admin.com', '1234567894', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'ADMIN'),
('John Doe', 'john@user.com', '9876543210', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Jane Smith', 'jane@user.com', '9876543211', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Mike Johnson', 'mike@user.com', '9876543212', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Emily Davis', 'emily@user.com', '9876543213', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('David Wilson', 'david@user.com', '9876543214', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Sarah Brown', 'sarah@user.com', '9876543215', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Chris Taylor', 'chris@user.com', '9876543216', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Jessica Anderson', 'jessica@user.com', '9876543217', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Matt Thomas', 'matt@user.com', '9876543218', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Ashley Jackson', 'ashley@user.com', '9876543219', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Kevin White', 'kevin@user.com', '9876543220', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Amanda Harris', 'amanda@user.com', '9876543221', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Brian Martin', 'brian@user.com', '9876543222', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Melissa Thompson', 'melissa@user.com', '9876543223', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Ryan Garcia', 'ryan@user.com', '9876543224', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Nicole Martinez', 'nicole@user.com', '9876543225', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Jason Robinson', 'jason@user.com', '9876543226', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Heather Clark', 'heather@user.com', '9876543227', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Gary Rodriguez', 'gary@user.com', '9876543228', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Amy Lewis', 'amy@user.com', '9876543229', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Justin Lee', 'justin@user.com', '9876543230', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Rachel Walker', 'rachel@user.com', '9876543231', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Scott Hall', 'scott@user.com', '9876543232', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Stephanie Allen', 'stephanie@user.com', '9876543233', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER'),
('Brandon Young', 'brandon@user.com', '9876543234', '$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q', 'CUSTOMER');

-- Insert Restaurants
INSERT INTO restaurants (owner_id, name, city, pincode, cuisine) VALUES 
(1, 'Spicy Treats', 'New York', '10001', 'Indian'),
(1, 'Burger King', 'New York', '10002', 'American'),
(1, 'Pasta Palace', 'Chicago', '60001', 'Italian'),
(2, 'Sushi Zen', 'San Francisco', '94016', 'Japanese'),
(2, 'Taco Bell', 'Los Angeles', '90001', 'Mexican'),
(1, 'Curry House', 'Seattle', '98101', 'Indian'),
(2, 'Pizza Hut', 'New York', '10003', 'Italian'),
(1, 'Wok this Way', 'Chicago', '60002', 'Chinese'),
(2, 'BBQ Nation', 'Austin', '73301', 'American'),
(1, 'Dosa Diner', 'San Francisco', '94017', 'Indian'),
(2, 'Pho Real', 'Seattle', '98102', 'Vietnamese'),
(1, 'Salad Days', 'Los Angeles', '90002', 'Healthy'),
(2, 'Sweet Tooth', 'New York', '10004', 'Dessert'),
(1, 'Bento Box', 'Austin', '73302', 'Japanese'),
(2, 'Falafel Fix', 'Chicago', '60003', 'Middle Eastern'),
(1, 'Steakhouse Supreme', 'Dallas', '75001', 'American'),
(2, 'Dim Sum Delight', 'San Francisco', '94018', 'Chinese'),
(1, 'Greek Taverna', 'New York', '10005', 'Greek'),
(2, 'Vegan Vibes', 'Los Angeles', '90003', 'Healthy'),
(1, 'French Bistro', 'Chicago', '60004', 'French');

-- Insert Menu Items (100 items - 5 per restaurant)
INSERT INTO menu_items (restaurant_id, name, description, price, is_veg, category, available_qty) VALUES
(1, 'Chicken Biryani', 'Spicy chicken biryani', 15.99, false, 'Main Course', 50), (1, 'Paneer Tikka', 'Grilled cottage cheese', 12.99, true, 'Starter', 30), (1, 'Garlic Naan', 'Indian bread', 3.50, true, 'Bread', 150), (1, 'Dal Makhani', 'Creamy lentils', 11.50, true, 'Main Course', 40), (1, 'Gulab Jamun', 'Sweet dessert', 4.99, true, 'Dessert', 60),
(2, 'Whopper', 'Signature burger', 8.99, false, 'Burger', 100), (2, 'Fries', 'Crispy french fries', 3.99, true, 'Sides', 200), (2, 'Onion Rings', 'Fried onion rings', 4.50, true, 'Sides', 150), (2, 'Chicken Nuggets', '10 pc nuggets', 5.99, false, 'Sides', 120), (2, 'Vanilla Shake', 'Thick milkshake', 4.99, true, 'Drinks', 80),
(3, 'Margherita Pizza', 'Classic cheese pizza', 14.50, true, 'Pizza', 40), (3, 'Pasta Carbonara', 'Creamy pasta', 16.50, false, 'Pasta', 35), (3, 'Garlic Bread', 'Cheesy garlic bread', 5.50, true, 'Sides', 100), (3, 'Tiramisu', 'Coffee dessert', 7.50, true, 'Dessert', 30), (3, 'Caesar Salad', 'Fresh salad', 9.00, true, 'Salad', 45),
(4, 'Salmon Roll', 'Fresh salmon sushi', 12.00, false, 'Sushi', 60), (4, 'Miso Soup', 'Traditional soup', 4.50, true, 'Soup', 80), (4, 'Edamame', 'Steamed beans', 4.50, true, 'Starter', 90), (4, 'Spicy Tuna Roll', 'Tuna with spicy mayo', 13.50, false, 'Sushi', 50), (4, 'Green Tea Mochi', 'Ice cream', 5.00, true, 'Dessert', 40),
(5, 'Crunchwrap', 'Supreme crunchy wrap', 6.99, false, 'Wrap', 150), (5, 'Nachos', 'Cheesy nachos', 5.99, true, 'Sides', 120), (5, 'Soft Taco', 'Beef taco', 2.99, false, 'Taco', 200), (5, 'Quesadilla', 'Cheese quesadilla', 4.99, true, 'Sides', 100), (5, 'Churros', 'Fried dough pastry', 3.99, true, 'Dessert', 80),
(6, 'Butter Chicken', 'Creamy chicken curry', 17.99, false, 'Main Course', 45), (6, 'Garlic Naan', 'Indian bread', 3.50, true, 'Bread', 150), (6, 'Samosa', 'Potato stuffed pastry', 4.50, true, 'Starter', 100), (6, 'Chicken Tikka', 'Grilled chicken', 13.99, false, 'Starter', 60), (6, 'Mango Lassi', 'Yogurt drink', 4.00, true, 'Drinks', 80),
(7, 'Pepperoni Pizza', 'Meat lover pizza', 16.99, false, 'Pizza', 50), (7, 'Garlic Bread', 'Cheesy garlic bread', 5.50, true, 'Sides', 100), (7, 'Cheese Pizza', 'Classic cheese', 14.99, true, 'Pizza', 60), (7, 'Wings', 'Buffalo wings 8pc', 9.99, false, 'Sides', 80), (7, 'Coke', 'Can of coke', 2.00, true, 'Drinks', 200),
(8, 'Kung Pao Chicken', 'Spicy stir fry', 14.99, false, 'Main Course', 60), (8, 'Spring Rolls', 'Crispy rolls', 6.50, true, 'Starter', 80), (8, 'Fried Rice', 'Chicken fried rice', 11.99, false, 'Main Course', 70), (8, 'Wonton Soup', 'Pork wontons in broth', 7.50, false, 'Soup', 50), (8, 'Fortune Cookie', 'Sweet cookie', 1.00, true, 'Dessert', 300),
(9, 'Brisket', 'Slow smoked brisket', 22.00, false, 'Main Course', 30), (9, 'Coleslaw', 'Fresh cabbage slaw', 4.00, true, 'Sides', 70), (9, 'Ribs', 'Half rack of ribs', 18.50, false, 'Main Course', 40), (9, 'Mac and Cheese', 'Creamy macaroni', 6.50, true, 'Sides', 60), (9, 'Cornbread', 'Sweet cornbread', 3.50, true, 'Sides', 90),
(10, 'Masala Dosa', 'Crispy crepe', 10.99, true, 'Main Course', 80), (10, 'Idli', 'Steamed rice cakes', 6.99, true, 'Starter', 100), (10, 'Vada', 'Fried lentil donut', 5.99, true, 'Starter', 90), (10, 'Filter Coffee', 'South Indian coffee', 3.50, true, 'Drinks', 150), (10, 'Rava Dosa', 'Semolina crepe', 11.50, true, 'Main Course', 50),
(11, 'Beef Pho', 'Noodle soup', 13.50, false, 'Soup', 55), (11, 'Summer Rolls', 'Fresh rolls', 7.50, true, 'Starter', 65), (11, 'Chicken Banh Mi', 'Vietnamese sandwich', 8.50, false, 'Main Course', 45), (11, 'Vietnamese Coffee', 'Iced coffee with milk', 4.50, true, 'Drinks', 80), (11, 'Pork Chop Rice', 'Grilled pork over rice', 12.99, false, 'Main Course', 40),
(12, 'Caesar Salad', 'Classic salad', 9.99, true, 'Salad', 40), (12, 'Quinoa Bowl', 'Healthy bowl', 12.99, true, 'Main Course', 50), (12, 'Green Smoothie', 'Kale and spinach', 6.50, true, 'Drinks', 60), (12, 'Avocado Toast', 'Toast with avocado', 8.50, true, 'Main Course', 45), (12, 'Fruit Bowl', 'Mixed seasonal fruits', 7.00, true, 'Sides', 55),
(13, 'Cheesecake', 'NY style', 7.50, true, 'Dessert', 30), (13, 'Brownie', 'Fudge brownie', 5.50, true, 'Dessert', 40), (13, 'Chocolate Chip Cookie', 'Fresh baked cookie', 3.00, true, 'Dessert', 100), (13, 'Apple Pie', 'Slice of apple pie', 6.00, true, 'Dessert', 35), (13, 'Ice Cream Sundae', 'Vanilla with chocolate syrup', 6.50, true, 'Dessert', 50),
(14, 'Chicken Teriyaki', 'Sweet soy chicken', 15.50, false, 'Main Course', 45), (14, 'Edamame', 'Steamed beans', 4.50, true, 'Starter', 90), (14, 'Spicy Tuna Bowl', 'Tuna over rice', 14.50, false, 'Main Course', 40), (14, 'Gyoza', 'Pan fried dumplings', 7.50, false, 'Starter', 60), (14, 'Matcha Tea', 'Hot green tea', 3.50, true, 'Drinks', 100),
(15, 'Falafel Wrap', 'Veggie wrap', 9.50, true, 'Wrap', 60), (15, 'Hummus', 'Chickpea dip', 6.50, true, 'Sides', 80), (15, 'Chicken Shawarma', 'Roasted chicken wrap', 10.50, false, 'Wrap', 70), (15, 'Baba Ganoush', 'Eggplant dip', 7.00, true, 'Sides', 60), (15, 'Baklava', 'Sweet pastry', 4.50, true, 'Dessert', 90),
(16, 'Ribeye Steak', '12oz Ribeye', 35.00, false, 'Main Course', 25), (16, 'Mashed Potatoes', 'Creamy potatoes', 6.00, true, 'Sides', 60), (16, 'Asparagus', 'Grilled asparagus', 7.50, true, 'Sides', 40), (16, 'Filet Mignon', '8oz Filet', 40.00, false, 'Main Course', 20), (16, 'Cheesecake', 'NY style', 9.00, true, 'Dessert', 30),
(17, 'Pork Dumplings', 'Steamed dumplings', 8.50, false, 'Dim Sum', 80), (17, 'Shrimp Har Gow', 'Shrimp dumplings', 9.50, false, 'Dim Sum', 70), (17, 'BBQ Pork Buns', 'Steamed buns', 7.50, false, 'Dim Sum', 90), (17, 'Egg Tarts', 'Sweet tart', 5.50, true, 'Dessert', 60), (17, 'Jasmine Tea', 'Hot tea', 3.00, true, 'Drinks', 150),
(18, 'Gyros Plate', 'Lamb/Beef gyros', 14.50, false, 'Main Course', 50), (18, 'Greek Salad', 'Feta and olives', 9.50, true, 'Salad', 60), (18, 'Tzatziki', 'Yogurt dip with pita', 6.50, true, 'Sides', 70), (18, 'Souvlaki', 'Chicken skewers', 13.50, false, 'Main Course', 45), (18, 'Spanakopita', 'Spinach pie', 8.00, true, 'Starter', 55),
(19, 'Vegan Burger', 'Beyond meat patty', 13.99, true, 'Main Course', 60), (19, 'Sweet Potato Fries', 'Baked fries', 5.50, true, 'Sides', 80), (19, 'Tofu Scramble', 'Breakfast scramble', 11.00, true, 'Main Course', 50), (19, 'Kombucha', 'Probiotic drink', 4.50, true, 'Drinks', 100), (19, 'Vegan Brownie', 'Dairy free brownie', 4.00, true, 'Dessert', 70),
(20, 'Croissant', 'Butter croissant', 4.50, true, 'Bread', 80), (20, 'French Onion Soup', 'Classic soup', 8.50, false, 'Soup', 50), (20, 'Steak Frites', 'Steak and fries', 26.00, false, 'Main Course', 30), (20, 'Escargot', 'Snails in garlic butter', 12.50, false, 'Starter', 25), (20, 'Crème Brûlée', 'Custard dessert', 9.00, true, 'Dessert', 40);

-- Insert Orders (Generate ~200 orders across 6 months). 
-- This uses a CTE to generate dates, but for MySQL 8 compatibility we will just insert multiple blocks.
-- To save space in this file, we will construct 100 orders explicitly.
INSERT INTO orders (user_id, restaurant_id, status, total_amount, order_date) VALUES
(6, 1, 'DELIVERED', 32.48, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 170 DAY)),
(7, 2, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 165 DAY)),
(8, 3, 'DELIVERED', 31.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 160 DAY)),
(9, 4, 'DELIVERED', 16.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 155 DAY)),
(10, 5, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 150 DAY)),
(11, 6, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 145 DAY)),
(12, 7, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 140 DAY)),
(13, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 135 DAY)),
(14, 9, 'DELIVERED', 26.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 130 DAY)),
(15, 10, 'DELIVERED', 17.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 125 DAY)),
(16, 11, 'DELIVERED', 21.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 120 DAY)),
(17, 12, 'DELIVERED', 22.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 115 DAY)),
(18, 13, 'DELIVERED', 13.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 110 DAY)),
(19, 14, 'DELIVERED', 20.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 105 DAY)),
(20, 15, 'DELIVERED', 16.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 100 DAY)),
(21, 16, 'DELIVERED', 41.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 95 DAY)),
(22, 17, 'DELIVERED', 18.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 90 DAY)),
(23, 18, 'DELIVERED', 24.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 85 DAY)),
(24, 19, 'DELIVERED', 19.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 80 DAY)),
(25, 20, 'DELIVERED', 30.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 75 DAY)),
(26, 1, 'DELIVERED', 28.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 70 DAY)),
(27, 2, 'DELIVERED', 17.97, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 68 DAY)),
(28, 3, 'CANCELLED', 20.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 65 DAY)),
(29, 4, 'DELIVERED', 25.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 60 DAY)),
(30, 5, 'DELIVERED', 11.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 58 DAY)),
(6, 6, 'DELIVERED', 35.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 55 DAY)),
(7, 7, 'DELIVERED', 26.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 52 DAY)),
(8, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 50 DAY)),
(9, 9, 'DELIVERED', 40.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 48 DAY)),
(10, 10, 'DELIVERED', 17.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 45 DAY)),
(11, 11, 'DELIVERED', 21.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 42 DAY)),
(12, 12, 'DELIVERED', 22.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 40 DAY)),
(13, 13, 'CANCELLED', 13.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 38 DAY)),
(14, 14, 'DELIVERED', 20.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 35 DAY)),
(15, 15, 'DELIVERED', 16.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 32 DAY)),
(16, 16, 'DELIVERED', 75.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY)),
(17, 17, 'DELIVERED', 25.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 28 DAY)),
(18, 18, 'DELIVERED', 24.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 25 DAY)),
(19, 19, 'DELIVERED', 19.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 22 DAY)),
(20, 20, 'DELIVERED', 30.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 20 DAY)),
(21, 1, 'DELIVERED', 32.48, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 DAY)),
(22, 2, 'CANCELLED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 16 DAY)),
(23, 3, 'DELIVERED', 31.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 DAY)),
(24, 4, 'DELIVERED', 16.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 12 DAY)),
(25, 5, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY)),
(26, 6, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 DAY)),
(27, 7, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 DAY)),
(28, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 DAY)),
(29, 9, 'DELIVERED', 26.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(30, 10, 'DELIVERED', 17.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(6, 11, 'PREPARING', 21.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)),
(7, 12, 'ON_THE_WAY', 22.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE)),
(8, 13, 'PLACED', 13.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)),
(9, 1, 'DELIVERED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(10, 1, 'DELIVERED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(11, 1, 'CANCELLED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(12, 1, 'DELIVERED', 28.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(13, 1, 'DELIVERED', 32.48, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(14, 1, 'DELIVERED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 DAY)),
(15, 1, 'CANCELLED', 15.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 DAY)),
(16, 2, 'DELIVERED', 8.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(17, 2, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(18, 2, 'DELIVERED', 17.97, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(19, 2, 'DELIVERED', 8.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(20, 2, 'DELIVERED', 13.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(21, 3, 'DELIVERED', 14.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(22, 3, 'DELIVERED', 16.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(23, 3, 'DELIVERED', 31.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(24, 3, 'DELIVERED', 14.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(25, 3, 'DELIVERED', 20.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(26, 4, 'DELIVERED', 12.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(27, 4, 'DELIVERED', 16.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(28, 4, 'DELIVERED', 25.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(29, 4, 'DELIVERED', 12.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(30, 4, 'DELIVERED', 17.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(6, 5, 'DELIVERED', 6.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(7, 5, 'DELIVERED', 12.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(8, 5, 'DELIVERED', 11.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(9, 5, 'DELIVERED', 6.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(10, 5, 'DELIVERED', 9.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(11, 6, 'DELIVERED', 17.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(12, 6, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(13, 6, 'DELIVERED', 35.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(14, 6, 'DELIVERED', 17.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(15, 6, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(16, 7, 'DELIVERED', 16.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(17, 7, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(18, 7, 'DELIVERED', 26.98, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(19, 7, 'DELIVERED', 16.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(20, 7, 'DELIVERED', 18.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(21, 8, 'DELIVERED', 14.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(22, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(23, 8, 'DELIVERED', 21.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(24, 8, 'DELIVERED', 14.99, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(25, 8, 'DELIVERED', 22.49, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)),
(26, 9, 'DELIVERED', 22.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
(27, 9, 'DELIVERED', 26.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
(28, 9, 'DELIVERED', 40.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
(29, 9, 'DELIVERED', 22.00, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
(30, 9, 'DELIVERED', 28.50, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY));


-- Insert Order Items (Corresponding to the orders above)
-- We will just insert 1-2 items per order to keep it simple but realistic.
-- Since order IDs are 1 to 100 in the above insert.
INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 1, 1, 15.99 FROM orders WHERE restaurant_id = 1;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 6, 1, 8.99 FROM orders WHERE restaurant_id = 2;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 11, 1, 14.50 FROM orders WHERE restaurant_id = 3;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 16, 1, 12.00 FROM orders WHERE restaurant_id = 4;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 21, 1, 6.99 FROM orders WHERE restaurant_id = 5;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 26, 1, 17.99 FROM orders WHERE restaurant_id = 6;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 31, 1, 16.99 FROM orders WHERE restaurant_id = 7;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 36, 1, 14.99 FROM orders WHERE restaurant_id = 8;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 41, 1, 22.00 FROM orders WHERE restaurant_id = 9;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 46, 1, 10.99 FROM orders WHERE restaurant_id = 10;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 51, 1, 13.50 FROM orders WHERE restaurant_id = 11;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 56, 1, 9.99 FROM orders WHERE restaurant_id = 12;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 61, 1, 7.50 FROM orders WHERE restaurant_id = 13;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 66, 1, 15.50 FROM orders WHERE restaurant_id = 14;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 71, 1, 9.50 FROM orders WHERE restaurant_id = 15;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 76, 1, 35.00 FROM orders WHERE restaurant_id = 16;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 81, 1, 8.50 FROM orders WHERE restaurant_id = 17;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 86, 1, 14.50 FROM orders WHERE restaurant_id = 18;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 91, 1, 13.99 FROM orders WHERE restaurant_id = 19;

INSERT INTO order_items (order_id, item_id, quantity, price_each) 
SELECT order_id, 96, 1, 4.50 FROM orders WHERE restaurant_id = 20;


-- Insert Payments for all orders
INSERT INTO payments (order_id, method, amount, status, payment_date)
SELECT order_id, 'CARD', total_amount, IF(status = 'CANCELLED', 'FAILED', 'SUCCESS'), order_date FROM orders;


-- Insert Ratings (Create ratings for most delivered orders)
INSERT INTO ratings (user_id, restaurant_id, rating_value, food_quality_rating, delivery_rating, packaging_rating, review_text)
SELECT user_id, restaurant_id, 
       ROUND(RAND() * 2 + 3, 1), -- random rating between 3 and 5
       ROUND(RAND() * 1 + 4, 1), -- food quality 4-5
       ROUND(RAND() * 2 + 2, 1), -- delivery 2-4
       ROUND(RAND() * 2 + 3, 1), -- packaging 3-5
       'Decent experience overall'
FROM orders WHERE status = 'DELIVERED' LIMIT 50;

-- Specifically update some ratings to have poor delivery scores to trigger the AI insight for Restaurant 1 (Spicy Treats)
UPDATE ratings SET rating_value = 3.0, food_quality_rating = 4.8, delivery_rating = 1.5, packaging_rating = 3.5, review_text = 'Food was amazing but took 2 hours to deliver and was cold.' WHERE user_id = 21 AND restaurant_id = 1;
UPDATE ratings SET rating_value = 2.5, food_quality_rating = 4.5, delivery_rating = 1.0, packaging_rating = 3.0, review_text = 'Delicious biryani but delivery driver was rude and late.' WHERE user_id = 26 AND restaurant_id = 1;


-- Insert Reels
INSERT INTO reels (restaurant_id, title, media_url, view_count) VALUES
(1, 'Making Biryani', 'https://s3.foodflow.com/reels/1', 1500), (1, 'Behind the Scenes', 'https://s3.foodflow.com/reels/21', 2500),
(2, 'Flipping Burgers', 'https://s3.foodflow.com/reels/2', 800), (2, 'Secret Sauce', 'https://s3.foodflow.com/reels/22', 1200),
(3, 'Pizza Toss', 'https://s3.foodflow.com/reels/3', 2200), (3, 'Fresh Dough', 'https://s3.foodflow.com/reels/23', 3400),
(4, 'Sushi Art', 'https://s3.foodflow.com/reels/4', 3100), (4, 'Slicing Salmon', 'https://s3.foodflow.com/reels/24', 4100),
(5, 'Crunchwrap Time', 'https://s3.foodflow.com/reels/5', 500), (5, 'Taco Tuesday', 'https://s3.foodflow.com/reels/25', 1500),
(6, 'Butter Chicken Simmer', 'https://s3.foodflow.com/reels/6', 1800), (6, 'Naan in Tandoor', 'https://s3.foodflow.com/reels/26', 2800),
(7, 'Cheese Pull', 'https://s3.foodflow.com/reels/7', 4500), (7, 'Delivery Prep', 'https://s3.foodflow.com/reels/27', 3500),
(8, 'Wok Fire', 'https://s3.foodflow.com/reels/8', 2900), (8, 'Dumpling Fold', 'https://s3.foodflow.com/reels/28', 1900),
(9, 'Smoking Brisket', 'https://s3.foodflow.com/reels/9', 5500), (9, 'BBQ Sauce Pour', 'https://s3.foodflow.com/reels/29', 6500),
(10, 'Dosa Flip', 'https://s3.foodflow.com/reels/10', 1200), (10, 'Idli Steam', 'https://s3.foodflow.com/reels/30', 2200);

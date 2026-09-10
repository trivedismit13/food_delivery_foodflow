-- V35__seed_realistic_dev_data.sql
-- Realistic interconnected development dataset for FoodFlow
-- TARGET: dev branch ONLY â€” DO NOT apply to production
-- All passwords = 'FoodFlow@2024'  (BCrypt $2b$10$)
-- Applied: 2026-09-11
--
-- ID ranges used:
--   Users (creators):   1001-1015
--   Users (customers):  2001-2050
--   Restaurants:        1001-1015
--   Menu Items:         3001-3172
--   Food Drops:         4001-4049
--   Drop Items:         4501-4625
--   Orders:             5001-5229
--   Order Items:        6001-6580
--   Payments:           7001-7229
--   Ratings:            8001-8068
--   Notifications:      9001-9040
--   Reels:              10001-10022

-- ============================================================
-- SECTION 1: CREATOR (SELLER) USERS  [1001-1015]
-- ============================================================
INSERT INTO users (user_id, name, email, phone, password, role, is_active) VALUES
(1001, 'Priya Sharma',      'priya.sharma@creator.com',     '9900001001', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1002, 'Aarti Devi',        'aarti.devi@creator.com',       '9900001002', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1003, 'Rahul Verma',       'rahul.verma@creator.com',      '9900001003', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1004, 'Mohammed Hussain',  'mohammed.hussain@creator.com', '9900001004', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1005, 'Sanjay Patil',      'sanjay.patil@creator.com',     '9900001005', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1006, 'Ritu Kapoor',       'ritu.kapoor@creator.com',      '9900001006', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1007, 'Karthik Iyer',      'karthik.iyer@creator.com',     '9900001007', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1008, 'Amit Das',          'amit.das@creator.com',         '9900001008', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1009, 'Neha Singh',        'neha.singh.creator@foodflow.com','9900001009','$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1010, 'Vikram Mehta',      'vikram.mehta@creator.com',     '9900001010', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1011, 'Bhavna Patel',      'bhavna.patel@creator.com',     '9900001011', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1012, 'Tenzin Gyatso',     'tenzin.gyatso@creator.com',    '9900001012', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1013, 'Sophia Fernandez',  'sophia.fernandez@creator.com', '9900001013', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1014, 'Mathew Thomas',     'mathew.thomas@creator.com',    '9900001014', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE),
(1015, 'Divya Reddy',       'divya.reddy@creator.com',      '9900001015', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'SELLER', TRUE);

-- ============================================================
-- SECTION 2: CUSTOMER USERS  [2001-2050]
-- ============================================================
INSERT INTO users (user_id, name, email, phone, password, role, is_active) VALUES
(2001, 'Aarav Sharma',         'aarav.sharma@example.com',      '9800002001', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2002, 'Priya Iyer',           'priya.iyer@example.com',        '9800002002', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2003, 'Rahul Gupta',          'rahul.gupta@example.com',       '9800002003', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2004, 'Sneha Nair',           'sneha.nair@example.com',        '9800002004', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2005, 'Vikash Pandey',        'vikash.pandey@example.com',     '9800002005', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2006, 'Divya Menon',          'divya.menon@example.com',       '9800002006', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2007, 'Kiran Patel',          'kiran.patel@example.com',       '9800002007', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2008, 'Aakash Verma',         'aakash.verma@example.com',      '9800002008', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2009, 'Riya Shah',            'riya.shah@example.com',         '9800002009', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2010, 'Suresh Kumar',         'suresh.kumar@example.com',      '9800002010', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2011, 'Pooja Mehta',          'pooja.mehta@example.com',       '9800002011', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2012, 'Ankit Joshi',          'ankit.joshi@example.com',       '9800002012', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2013, 'Meena Pillai',         'meena.pillai@example.com',      '9800002013', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2014, 'Rohit Agarwal',        'rohit.agarwal@example.com',     '9800002014', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2015, 'Swathi Krishnan',      'swathi.krishnan@example.com',   '9800002015', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2016, 'Abhishek Das',         'abhishek.das@example.com',      '9800002016', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2017, 'Kavya Reddy',          'kavya.reddy@example.com',       '9800002017', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2018, 'Siddharth Rao',        'siddharth.rao@example.com',     '9800002018', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2019, 'Manisha Bose',         'manisha.bose@example.com',      '9800002019', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2020, 'Nikhil Tiwari',        'nikhil.tiwari@example.com',     '9800002020', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2021, 'Tanvi Shah',           'tanvi.shah@example.com',        '9800002021', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2022, 'Deepak Nambiar',       'deepak.nambiar@example.com',    '9800002022', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2023, 'Ishita Chatterjee',    'ishita.chatterjee@example.com', '9800002023', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2024, 'Vishal Kumar',         'vishal.kumar@example.com',      '9800002024', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2025, 'Shreya Varma',         'shreya.varma@example.com',      '9800002025', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2026, 'Gaurav Malhotra',      'gaurav.malhotra@example.com',   '9800002026', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2027, 'Lakshmi Subramaniam',  'lakshmi.subramaniam@example.com','9800002027','$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2028, 'Rajiv Kapoor',         'rajiv.kapoor@example.com',      '9800002028', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2029, 'Ankita Singh',         'ankita.singh@example.com',      '9800002029', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2030, 'Mayur Desai',          'mayur.desai@example.com',       '9800002030', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2031, 'Chandni Mishra',       'chandni.mishra@example.com',    '9800002031', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2032, 'Aryan Patel',          'aryan.patel@example.com',       '9800002032', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2033, 'Preeti Nair',          'preeti.nair@example.com',       '9800002033', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2034, 'Saurabh Yadav',        'saurabh.yadav@example.com',     '9800002034', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2035, 'Bindu Krishnan',       'bindu.krishnan@example.com',    '9800002035', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2036, 'Tushar Shah',          'tushar.shah@example.com',       '9800002036', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2037, 'Archana Pillai',       'archana.pillai@example.com',    '9800002037', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2038, 'Vivek Menon',          'vivek.menon@example.com',       '9800002038', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2039, 'Shalini Gupta',        'shalini.gupta@example.com',     '9800002039', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2040, 'Pratik Das',           'pratik.das@example.com',        '9800002040', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2041, 'Megha Reddy',          'megha.reddy@example.com',       '9800002041', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2042, 'Shivam Jha',           'shivam.jha@example.com',        '9800002042', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2043, 'Hema Kiran',           'hema.kiran@example.com',        '9800002043', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2044, 'Abhinav Roy',          'abhinav.roy@example.com',       '9800002044', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2045, 'Padma Sundaram',       'padma.sundaram@example.com',    '9800002045', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2046, 'Kaushal Mehta',        'kaushal.mehta@example.com',     '9800002046', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2047, 'Ranjana Iyer',         'ranjana.iyer@example.com',      '9800002047', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2048, 'Pavan Kumar',          'pavan.kumar@example.com',       '9800002048', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2049, 'Vaishali Shah',        'vaishali.shah@example.com',     '9800002049', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE),
(2050, 'Girish Nambiar',       'girish.nambiar@example.com',    '9800002050', '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu', 'CUSTOMER', TRUE);

-- ============================================================
-- SECTION 3: RESTAURANTS (creator profiles)  [1001-1015]
-- ============================================================
INSERT INTO restaurants (restaurant_id, owner_id, name, city, pincode, cuisine, is_open,
    creator_type, bio, instagram_handle, verification_level, is_accepting_orders,
    pickup_address, avg_rating, follower_count, total_orders_completed, accepts_delivery)
VALUES
(1001, 1001, 'The Sourdough Story',    'Bangalore',  '560001', 'Bakery',        TRUE, 'HOME_BAKER',          'Artisan sourdough and European pastries baked fresh daily. Every loaf is a story.', 'sourdoughstory_blr',    3, TRUE, '12th Cross, Indiranagar, Bangalore',    0.00, 0, 0, FALSE),
(1002, 1002, 'Maa Ki Rasoi',           'Delhi',      '110001', 'North Indian',  TRUE, 'TIFFIN_SERVICE',      'Authentic homestyle North Indian thalis. Pure vegetarian. Tastes like home.',          'maakirasoidelhi',       2, TRUE, 'Lajpat Nagar Market, New Delhi',        0.00, 0, 0, FALSE),
(1003, 1003, 'Midnight Munchies',      'Mumbai',     '400001', 'Fast Food',     TRUE, 'CLOUD_KITCHEN',       'Your late-night cravings sorted. Burgers, fries and shakes made to order.',             'midnightmunchies_mum',  0, TRUE, 'Bandra West, Mumbai',                   0.00, 0, 0, FALSE),
(1004, 1004, 'Sunday Biryani Club',    'Hyderabad',  '500001', 'Hyderabadi',    TRUE, 'WEEKEND_CHEF',        'Authentic Dum Biryani slow-cooked over wood-fire. Weekend only. Worth the wait.',       'sundaybiryaniclub',     3, TRUE, 'Jubilee Hills, Hyderabad',              0.00, 0, 0, FALSE),
(1005, 1005, 'Bombay Vada Pav',        'Pune',       '411001', 'Street Food',   TRUE, 'CAMPUS_SELLER',       'The best Vada Pav outside Mumbai â€” with our secret dry garlic chutney.',               'bombayvadapav_pune',    1, TRUE, 'FC Road, Deccan Gymkhana, Pune',        0.00, 0, 0, FALSE),
(1006, 1006, 'Keto Kitchen',           'Bangalore',  '560034', 'Healthy',       TRUE, 'HEALTHY_MEALS',       'Guilt-free, low-carb, high-fat keto meals and desserts. Macros on every dish.',         'ketokitchen_blr',       2, TRUE, 'HSR Layout Sector 2, Bangalore',        0.00, 0, 0, FALSE),
(1007, 1007, 'Chennai Spice',          'Chennai',    '600001', 'South Indian',  TRUE, 'HOME_BAKER',          'Filter coffee and crispy dosas just like your grandmother made them.',                  'chennaispice_chn',      1, TRUE, 'T. Nagar, Chennai',                     0.00, 0, 0, FALSE),
(1008, 1008, 'Bengali Sweets Corner',  'Kolkata',    '700001', 'Desserts',      TRUE, 'SPECIALTY_DESSERTS',  'Authentic Rosogolla and Sandesh made fresh. Third-generation sweet makers.',             'bengalisweetscorner',   3, TRUE, 'College Street, Kolkata',               0.00, 0, 0, FALSE),
(1009, 1009, 'Fit Bites',              'Delhi',      '110016', 'Salads',        TRUE, 'HEALTHY_MEALS',       'Protein-packed salads and power bowls for fitness enthusiasts. Nutritionist designed.',  'fitbites_delhi',        2, TRUE, 'Hauz Khas Village, New Delhi',          0.00, 0, 0, FALSE),
(1010, 1010, 'The Pasta Bar',          'Mumbai',     '400050', 'Italian',       TRUE, 'CLOUD_KITCHEN',       'Handmade pasta with rich, slow-cooked sauces. Italy, delivered to your doorstep.',       'thepastabar_mum',       2, TRUE, 'Bandra West, Mumbai',                   0.00, 0, 0, FALSE),
(1011, 1011, 'Gujarati Thali House',   'Ahmedabad',  '380001', 'Gujarati',      TRUE, 'TIFFIN_SERVICE',      'Traditional Kathiyawadi and Gujarati thalis. Unlimited rotis, endless love.',            'gujaratithalihouse',    1, TRUE, 'CG Road, Ahmedabad',                    0.00, 0, 0, FALSE),
(1012, 1012, 'Momos & More',           'Delhi',      '110092', 'Tibetan',       TRUE, 'WEEKEND_CHEF',        'Steamed and fried momos with spicy red chutney. Tibetan soul food in Delhi.',            'momosandmoredelhi',     1, TRUE, 'Laxmi Nagar, New Delhi',                0.00, 0, 0, FALSE),
(1013, 1013, 'Bake My Day',            'Panaji',     '403001', 'Bakery',        TRUE, 'HOME_BAKER',          'Custom celebration cakes and Portuguese Goan sweets. Est. in a tiny Panaji kitchen.',   'bakemydaygoa',          2, TRUE, 'Fontainhas, Panaji, Goa',               0.00, 0, 0, FALSE),
(1014, 1014, 'Kerala Kitchen',         'Bangalore',  '560008', 'Kerala',        TRUE, 'CLOUD_KITCHEN',       'Appam, stew and authentic Kerala seafood. A slice of Kerala in Bangalore.',              'keralakitchenblr',      3, TRUE, 'Koramangala 5th Block, Bangalore',      0.00, 0, 0, FALSE),
(1015, 1015, 'Millet Magic',           'Hyderabad',  '500072', 'Healthy',       TRUE, 'HEALTHY_MEALS',       'Gluten-free, ancient grain based nutritious meals. Millets the way they should be.',     'milletmagic_hyd',       1, TRUE, 'Madhapur, Hyderabad',                   0.00, 0, 0, FALSE);

-- ============================================================
-- SECTION 4: CREATOR VERIFICATIONS  [creator_id = restaurant_id]
-- ============================================================
INSERT INTO creator_verifications (creator_id, current_level, phone_otp_verified,
    food_licence_number, food_licence_url, kitchen_photo_url_1, kitchen_photo_url_2)
VALUES
(1001, 3, TRUE,  'FSSAI-KA-2024-1001', 'https://docs.foodflow.dev/lic/1001.pdf', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg'),
(1002, 2, TRUE,  'FSSAI-DL-2024-1002', 'https://docs.foodflow.dev/lic/1002.pdf', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(1003, 0, FALSE, NULL, NULL, NULL, NULL),
(1004, 3, TRUE,  'FSSAI-TS-2024-1004', 'https://docs.foodflow.dev/lic/1004.pdf', 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg'),
(1005, 1, TRUE,  NULL, NULL, NULL, NULL),
(1006, 2, TRUE,  'FSSAI-KA-2024-1006', 'https://docs.foodflow.dev/lic/1006.pdf', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(1007, 1, TRUE,  NULL, NULL, NULL, NULL),
(1008, 3, TRUE,  'FSSAI-WB-2024-1008', 'https://docs.foodflow.dev/lic/1008.pdf', 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg',  'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg'),
(1009, 2, TRUE,  'FSSAI-DL-2024-1009', 'https://docs.foodflow.dev/lic/1009.pdf', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(1010, 2, TRUE,  'FSSAI-MH-2024-1010', 'https://docs.foodflow.dev/lic/1010.pdf', 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', NULL),
(1011, 1, TRUE,  NULL, NULL, NULL, NULL),
(1012, 1, TRUE,  NULL, NULL, NULL, NULL),
(1013, 2, TRUE,  'FSSAI-GA-2024-1013', 'https://docs.foodflow.dev/lic/1013.pdf', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', NULL),
(1014, 3, TRUE,  'FSSAI-KA-2024-1014', 'https://docs.foodflow.dev/lic/1014.pdf', 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg'),
(1015, 1, TRUE,  NULL, NULL, NULL, NULL);

-- ============================================================
-- SECTION 5: MENU ITEMS  [3001-3172]
-- ============================================================
-- Creator 1001 â€” The Sourdough Story (Bakery) [3001-3012]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3001, 1001, 'Artisan Sourdough Loaf',   'Country-style sourdough with 72-hr fermentation. Crisp crust, open crumb.',      280.00, TRUE,  'Bread',    20, FALSE),
(3002, 1001, 'Classic Croissant',         'Buttery, flaky all-butter croissant. Baked fresh every morning.',                  80.00, TRUE,  'Pastry',   30, FALSE),
(3003, 1001, 'Blueberry Muffin',          'Jumbo muffin packed with fresh blueberries and a sugary crust.',                   60.00, TRUE,  'Muffin',   40, FALSE),
(3004, 1001, 'Chocolate Brownie',         'Fudgy dark chocolate brownie with sea salt flakes. One piece.',                    55.00, TRUE,  'Dessert',  50, FALSE),
(3005, 1001, 'Cinnamon Roll',             'Soft swirled roll drenched in cream cheese frosting.',                             90.00, TRUE,  'Pastry',   25, FALSE),
(3006, 1001, 'Banana Bread',              'Moist banana bread with walnuts and a hint of vanilla.',                          180.00, TRUE,  'Bread',    15, FALSE),
(3007, 1001, 'Red Velvet Cake (Slice)',   'Layered red velvet with cream cheese frosting. One generous slice.',              150.00, TRUE,  'Cake',     20, FALSE),
(3008, 1001, 'Almond Biscotti',           'Twice-baked Italian biscotti with whole almonds. Pack of 6.',                    180.00, TRUE,  'Cookie',   30, FALSE),
(3009, 1001, 'Rosemary Focaccia',         'Thick Ligurian focaccia with fresh rosemary and sea salt.',                       220.00, TRUE,  'Bread',    15, FALSE),
(3010, 1001, 'Chocolate Chip Cookies',    'Bakery-style thick cookies with Belgian chocolate chips. Pack of 4.',             200.00, TRUE,  'Cookie',   35, FALSE),
(3011, 1001, 'NY Cheesecake Slice',       'Dense New York style cheesecake on graham cracker crust.',                        250.00, TRUE,  'Cake',     15, FALSE),
(3012, 1001, 'Pain au Chocolat',          'Flaky croissant dough encasing Belgian dark chocolate.',                           75.00, TRUE,  'Pastry',   30, FALSE);

-- Creator 1002 â€” Maa Ki Rasoi (North Indian Tiffin) [3013-3024]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3013, 1002, 'Dal Makhani Tiffin',        'Slow-cooked black lentils in buttery tomato gravy. With 2 phulkas.',              140.00, TRUE,  'Tiffin',   30, FALSE),
(3014, 1002, 'Roti Combo',                '4 fresh phulkas with sabzi and dal. Homestyle.',                                  100.00, TRUE,  'Tiffin',   40, FALSE),
(3015, 1002, 'Rajma Chawal',              'Creamy red kidney beans curry over steamed basmati rice.',                         130.00, TRUE,  'Main',     30, FALSE),
(3016, 1002, 'Paneer Butter Masala',      'Cottage cheese in rich tomato-cashew gravy. With 2 butter rotis.',               180.00, TRUE,  'Main',     25, FALSE),
(3017, 1002, 'Aloo Sabzi Tiffin',         'Dry aloo with jeera, methi leaves, and warm rotis.',                              110.00, TRUE,  'Tiffin',   35, FALSE),
(3018, 1002, 'Khichdi',                   'Comfort moong dal khichdi with ghee tadka and papad.',                            100.00, TRUE,  'Main',     30, FALSE),
(3019, 1002, 'Kadhai Paneer',             'Paneer and capsicum in robust kadhai masala. Semi-dry.',                           170.00, TRUE,  'Main',     25, FALSE),
(3020, 1002, 'Chole Bhature',             'Spiced chickpeas with 2 fluffy deep-fried bhaturas.',                             140.00, TRUE,  'Main',     20, FALSE),
(3021, 1002, 'Methi Thepla',              'Soft fenugreek flatbreads. Pack of 6 with aam ka achaar.',                         80.00, TRUE,  'Bread',    30, FALSE),
(3022, 1002, 'Chapati x4',                '4 fresh wheat rotis rolled thin and roasted on tawa.',                             50.00, TRUE,  'Bread',    50, FALSE),
(3023, 1002, 'Jeera Rice',                'Fragrant basmati rice tempered with cumin and ghee.',                              70.00, TRUE,  'Rice',     40, FALSE),
(3024, 1002, 'Raita',                     'Fresh yogurt with cucumber, pomegranate and mint chaat masala.',                   50.00, TRUE,  'Side',     50, FALSE);

-- Creator 1003 â€” Midnight Munchies (Fast Food) [3025-3034]  â€” ZERO DATA CREATOR
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3025, 1003, 'Classic Burger',            'Double patty smash burger with cheddar and special sauce.',                        150.00, FALSE, 'Burger',   30, FALSE),
(3026, 1003, 'Loaded Fries',              'Thick-cut fries with nacho cheese, jalapeÃ±os and sriracha.',                        80.00, TRUE,  'Sides',    40, FALSE),
(3027, 1003, 'Chicken Wrap',              'Grilled chicken strip wrap with garlic mayo and fresh slaw.',                      180.00, FALSE, 'Wrap',     25, FALSE),
(3028, 1003, 'Thick Milkshake',           'Oreo / Mango / Chocolate. 400ml thick and creamy shake.',                         120.00, TRUE,  'Beverage', 20, FALSE),
(3029, 1003, 'Nachos Platter',            'Tortilla chips with salsa, sour cream and jalapeÃ±os.',                             100.00, TRUE,  'Sides',    30, FALSE),
(3030, 1003, 'Onion Rings',               'Beer-battered crispy onion rings. Half dozen.',                                    70.00, TRUE,  'Sides',    30, FALSE),
(3031, 1003, 'BBQ Chicken Burger',        'Smoky BBQ sauce, crispy fried chicken, pickles and slaw.',                         200.00, FALSE, 'Burger',   20, FALSE),
(3032, 1003, 'Veg Club Sandwich',         'Triple-decker with cheese, cucumber, tomato and mustard.',                         100.00, TRUE,  'Sandwich', 25, FALSE),
(3033, 1003, 'Pizza Slice',               'NY-style cheese pizza slice, wood-fired flavour.',                                 120.00, TRUE,  'Pizza',    20, FALSE),
(3034, 1003, 'Waffle Fries',              'Crispy waffle-cut fries with dipping sauce of choice.',                             90.00, TRUE,  'Sides',    30, FALSE);

-- Creator 1004 â€” Sunday Biryani Club (Hyderabadi) [3035-3046]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3035, 1004, 'Mutton Dum Biryani',        'Slow-cooked Hyderabadi mutton biryani. Aged basmati, whole spices.',              350.00, FALSE, 'Biryani',  20, FALSE),
(3036, 1004, 'Chicken Dum Biryani',       'Tender chicken dum biryani with caramelised onions and saffron.',                 280.00, FALSE, 'Biryani',  25, FALSE),
(3037, 1004, 'Veg Dum Biryani',           'Seasonal vegetables, nuts and fried onions. Pakki dum style.',                    220.00, TRUE,  'Biryani',  20, FALSE),
(3038, 1004, 'Chicken Tikka',             'Tandoor-style chargrilled chicken tikka. Half portion 4 pcs.',                    250.00, FALSE, 'Starter',  20, FALSE),
(3039, 1004, 'Seekh Kebab',               'Minced mutton seekh kebab with mint chutney. 4 pcs.',                             200.00, FALSE, 'Starter',  20, FALSE),
(3040, 1004, 'Lamb Rogan Josh',           'Kashmiri slow-braised lamb in a cardamom-laden gravy.',                            300.00, FALSE, 'Main',     15, FALSE),
(3041, 1004, 'Haleem',                    'Slow-cooked meat and lentil porridge. Weekend special.',                           200.00, FALSE, 'Main',     20, FALSE),
(3042, 1004, 'Mirchi Ka Salan',           'Chilli and peanut gravy â€” the classic biryani accompaniment.',                    100.00, TRUE,  'Side',     30, FALSE),
(3043, 1004, 'Burani Raita',              'Garlic-spiked yogurt with roasted cumin. Large portion.',                          60.00, TRUE,  'Side',     50, FALSE),
(3044, 1004, 'Boti Kebab',                'Marinated mutton chunks skewered and charred over coal.',                          220.00, FALSE, 'Starter',  15, FALSE),
(3045, 1004, 'Double Ka Meetha',          'Hyderabadi bread pudding with khoya, saffron, dry fruits.',                       120.00, TRUE,  'Dessert',  25, FALSE),
(3046, 1004, 'Chicken Korma',             'Mughlai chicken in a white onion and cashew gravy.',                               240.00, FALSE, 'Main',     20, FALSE);

-- Creator 1005 â€” Bombay Vada Pav (Street Food) [3047-3056]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3047, 1005, 'Classic Vada Pav',          'The OG Mumbai street food. Potato vada in soft pav with 3 chutneys.',              60.00, TRUE,  'Street',   60, FALSE),
(3048, 1005, 'Pav Bhaji',                 'Buttery mashed vegetable bhaji with toasted pav. 2 pav.',                         120.00, TRUE,  'Street',   30, FALSE),
(3049, 1005, 'Misal Pav',                 'Spicy sprouted moth bean curry topped with farsan. 2 pav.',                        100.00, TRUE,  'Street',   25, FALSE),
(3050, 1005, 'Bhel Puri',                 'Puffed rice with tamarind chutney, onion, and coriander.',                         70.00, TRUE,  'Chaat',    40, FALSE),
(3051, 1005, 'Sev Puri',                  'Crispy puris topped with potato, chutneys and sev.',                               80.00, TRUE,  'Chaat',    35, FALSE),
(3052, 1005, 'Ragda Pattice',             'Spiced white pea curry over potato patties with chutneys.',                        100.00, TRUE,  'Chaat',    25, FALSE),
(3053, 1005, 'Dabeli',                    'Spiced potato filling in a bun with pomegranate and sev.',                          70.00, TRUE,  'Street',   35, FALSE),
(3054, 1005, 'Dahi Puri',                 'Crispy puris filled with potato, yogurt, and sweet chutney.',                       80.00, TRUE,  'Chaat',    30, FALSE),
(3055, 1005, 'Samosa (2 pcs)',            'Crispy triangular pastry filled with spiced aloo-matar.',                           50.00, TRUE,  'Snack',    50, FALSE),
(3056, 1005, 'Cutting Chai',              'Mumbai-style strong brewed masala chai. 120ml glass.',                              30.00, TRUE,  'Beverage', 80, FALSE);

-- Creator 1006 â€” Keto Kitchen (Healthy Meals) [3057-3068]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3057, 1006, 'Keto Salad Bowl',           'Greens, avocado, grilled chicken, nuts with lemon-olive dressing.',               250.00, FALSE, 'Salad',    15, FALSE),
(3058, 1006, 'Bulletproof Coffee',        'MCT oil blended black coffee for sustained energy. 250ml.',                        150.00, TRUE,  'Beverage', 20, FALSE),
(3059, 1006, 'Keto Pancakes',             'Almond flour pancakes with erythritol syrup and berries. 3 pcs.',                 200.00, TRUE,  'Breakfast',15, FALSE),
(3060, 1006, 'Avocado Egg Bowl',          'Halved avocado with 2 sunny-side eggs, feta and micro greens.',                   280.00, TRUE,  'Breakfast',12, FALSE),
(3061, 1006, 'Cauliflower Fried Rice',    'Cauliflower rice stir-fried with egg, soy and sesame.',                           200.00, TRUE,  'Main',     20, FALSE),
(3062, 1006, 'Keto Brownie',              'Dense dark chocolate brownie sweetened with monk fruit. 2 pcs.',                  120.00, TRUE,  'Dessert',  25, FALSE),
(3063, 1006, 'Zucchini Pasta',            'Spiralised zucchini with pesto and cherry tomatoes.',                              220.00, TRUE,  'Main',     15, FALSE),
(3064, 1006, 'Grilled Chicken Bowl',      '200g grilled chicken breast, roasted veggies, tahini drizzle.',                   300.00, FALSE, 'Main',     15, FALSE),
(3065, 1006, 'Cheese Omelette',           '3-egg fluffy omelette loaded with cheddar and herbs.',                            180.00, TRUE,  'Breakfast',20, FALSE),
(3066, 1006, 'Keto Fat Bombs',            'Coconut oil and peanut butter fat bombs. Pack of 4.',                             150.00, TRUE,  'Snack',    25, FALSE),
(3067, 1006, 'Almond Flour Bread',        'Grain-free sandwich bread sliced and ready. 4 slices.',                           200.00, TRUE,  'Bread',    15, FALSE),
(3068, 1006, 'Keto Pizza',                '8-inch cauliflower base pizza with mozzarella and veggies.',                       350.00, TRUE,  'Main',     10, FALSE);

-- Creator 1007 â€” Chennai Spice (South Indian) [3069-3080]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3069, 1007, 'Ghee Roast Masala Dosa',   'Extra crispy dosa on tawa ghee with potato masala, sambar, chutneys.',            120.00, TRUE,  'Tiffin',   30, FALSE),
(3070, 1007, 'Idli Sambar (3 pcs)',       'Soft steamed idlis with piping hot sambar and 2 chutneys.',                       100.00, TRUE,  'Tiffin',   40, FALSE),
(3071, 1007, 'Medu Vada (2 pcs)',         'Crispy lentil donuts. Served with sambar and coconut chutney.',                    80.00, TRUE,  'Tiffin',   35, FALSE),
(3072, 1007, 'Filter Coffee (Davara)',    'Traditional South Indian filter decoction with full-fat milk. 150ml.',             40.00, TRUE,  'Beverage', 60, FALSE),
(3073, 1007, 'Rava Upma',                 'Semolina tempered with mustard, curry leaves and green chilli.',                   80.00, TRUE,  'Breakfast',30, FALSE),
(3074, 1007, 'Rava Dosa',                 'Thin, crispy semolina crepe with onion and green chilli.',                        110.00, TRUE,  'Tiffin',   25, FALSE),
(3075, 1007, 'Ven Pongal',                'Comfort rice-lentil khichdi with generous ghee and pepper.',                      100.00, TRUE,  'Breakfast',25, FALSE),
(3076, 1007, 'Curd Rice',                 'Cool, creamy curd rice tempered with mustard and pomegranate.',                    90.00, TRUE,  'Main',     30, FALSE),
(3077, 1007, 'Pepper Rasam',              'Thin, tangy peppery tomato rasam. Best drunk from a glass.',                       60.00, TRUE,  'Soup',     40, FALSE),
(3078, 1007, 'Coconut Chutney (extra)',   'Fresh-ground coconut chutney with roasted chana dal. 100ml.',                      40.00, TRUE,  'Side',     50, FALSE),
(3079, 1007, 'Tomato Rice',               'Tangy cooked tomato rice with curry leaves and peanuts.',                          90.00, TRUE,  'Rice',     25, FALSE),
(3080, 1007, 'Kallappam',                 'Soft, lacy fermented rice pancake. Pair with coconut stew.',                      110.00, TRUE,  'Tiffin',   20, FALSE);

-- Creator 1008 â€” Bengali Sweets Corner (Specialty Desserts) [3081-3092]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3081, 1008, 'Rosogolla (6 pcs)',         'Spongy chenna balls in light sugar syrup. The original Kolkata style.',           140.00, TRUE,  'Sweets',   30, FALSE),
(3082, 1008, 'Sandesh (6 pcs)',           'Fresh chenna shaped and flavoured sweets. Classic Bengali misti.',                 180.00, TRUE,  'Sweets',   25, FALSE),
(3083, 1008, 'Mishti Doi',                'Set sweetened yogurt with jaggery. Served in earthen matka.',                     100.00, TRUE,  'Dairy',    30, FALSE),
(3084, 1008, 'Kaju Barfi (250g)',         'Premium cashew fudge squares with silver leaf. Festive quality.',                  350.00, TRUE,  'Sweets',   20, FALSE),
(3085, 1008, 'Rasgulla (6 pcs)',          'Soft chenna balls soaked in rose-scented sugar syrup.',                           130.00, TRUE,  'Sweets',   30, FALSE),
(3086, 1008, 'Pantua (6 pcs)',            'Deep-fried Bengali gulab jamun in thickened syrup.',                              150.00, TRUE,  'Sweets',   25, FALSE),
(3087, 1008, 'Chum Chum (4 pcs)',         'Oblong chenna sweets dipped in coconut or pistachio coating.',                    200.00, TRUE,  'Sweets',   20, FALSE),
(3088, 1008, 'Ladikeni (4 pcs)',          'Large dark Bengali gulab jamun. Rich and syrupy.',                                 160.00, TRUE,  'Sweets',   20, FALSE),
(3089, 1008, 'Chomchom (4 pcs)',          'Cottage cheese sweet soaked in flavoured syrup. Pastel coloured.',                180.00, TRUE,  'Sweets',   20, FALSE),
(3090, 1008, 'Kalojam (6 pcs)',           'Darkened fried chenna balls in thick sugar syrup.',                                140.00, TRUE,  'Sweets',   25, FALSE),
(3091, 1008, 'Malai Chop (4 pcs)',        'Chenna patties cooked in reduced cream. Light and delicate.',                     220.00, TRUE,  'Sweets',   15, FALSE),
(3092, 1008, 'Nolen Gurer Sondesh (6)', 'Winter special. Chenna with date palm jaggery. Seasonal.',                         180.00, TRUE,  'Sweets',   15, FALSE);

-- Creator 1009 â€” Fit Bites (Healthy Meals) [3093-3104]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3093, 1009, 'Green Detox Salad',         'Kale, spinach, cucumber, apple with lemon-ginger dressing.',                      250.00, TRUE,  'Salad',    15, FALSE),
(3094, 1009, 'Quinoa Bowl',               'Red quinoa with roasted veggies and tahini dressing.',                             280.00, TRUE,  'Bowl',     15, FALSE),
(3095, 1009, 'High Protein Bowl',         'Grilled chicken, edamame, chickpeas, eggs. 38g protein per bowl.',                 300.00, FALSE, 'Bowl',     12, FALSE),
(3096, 1009, 'Chia Pudding',              'Overnight chia in almond milk with mango and berries.',                            180.00, TRUE,  'Dessert',  20, FALSE),
(3097, 1009, 'Buddha Bowl',               'Grain base, roasted veggies, hummus, pickled onion, tahini.',                     320.00, TRUE,  'Bowl',     12, FALSE),
(3098, 1009, 'Spirulina Smoothie',        'Banana, spinach, spirulina and coconut water. 400ml.',                             200.00, TRUE,  'Beverage', 20, FALSE),
(3099, 1009, 'Overnight Oats',            'Rolled oats soaked in oat milk with seeds, dates and berries.',                    150.00, TRUE,  'Breakfast',25, FALSE),
(3100, 1009, 'Red Lentil Soup',           'Turmeric spiced masoor dal soup. 300ml.',                                          120.00, TRUE,  'Soup',     20, FALSE),
(3101, 1009, 'Multigrain Veggie Wrap',    'Multigrain wrap with hummus, grilled veggies and feta.',                           200.00, TRUE,  'Wrap',     15, FALSE),
(3102, 1009, 'Seasonal Fruit Bowl',       'Mixed diced seasonal fruits. No sugar added. 300g.',                               150.00, TRUE,  'Snack',    20, FALSE),
(3103, 1009, 'Power Salad',               'Broccoli, chickpea, avocado, seeds with apple cider vinaigrette.',                 270.00, TRUE,  'Salad',    12, FALSE),
(3104, 1009, 'Acai Bowl',                 'Frozen acai base with granola, coconut, berries and honey.',                       300.00, TRUE,  'Bowl',     10, FALSE);

-- Creator 1010 â€” The Pasta Bar (Italian) [3105-3116]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3105, 1010, 'Spaghetti Carbonara',       'Egg-based Roman carbonara with guanciale and Pecorino. No cream.',               350.00, FALSE, 'Pasta',    15, FALSE),
(3106, 1010, 'Penne Arrabiata',           'Spicy San Marzano tomato sauce over penne. Finished with fresh basil.',           280.00, TRUE,  'Pasta',    20, FALSE),
(3107, 1010, 'Fettuccine Alfredo',        'Silky fettuccine in a Parmesan cream sauce. Classic comfort.',                    320.00, TRUE,  'Pasta',    15, FALSE),
(3108, 1010, 'Vegetable Lasagna',         'Layered bÃ©chamel and roasted vegetable lasagna. Serves 1.',                       380.00, TRUE,  'Pasta',    10, FALSE),
(3109, 1010, 'Bruschetta al Pomodoro',    'Grilled sourdough with marinated heritage tomatoes and basil.',                   150.00, TRUE,  'Starter',  20, FALSE),
(3110, 1010, 'Classic Tiramisu',          'Espresso-soaked ladyfinger layers with mascarpone. Individual pot.',              200.00, TRUE,  'Dessert',  15, FALSE),
(3111, 1010, 'Cheesy Garlic Bread',       'Rustic baguette with garlic butter, Parmesan and herbs. 2 pcs.',                  100.00, TRUE,  'Sides',    25, FALSE),
(3112, 1010, 'Mushroom Risotto',          'Arborio rice with porcini mushrooms, white wine, Parmesan.',                      340.00, TRUE,  'Risotto',  10, FALSE),
(3113, 1010, 'Pasta Al Pomodoro',         'Simple perfect: San Marzano tomatoes, olive oil, basil.',                         280.00, TRUE,  'Pasta',    20, FALSE),
(3114, 1010, 'Potato Gnocchi',            'Pillowy potato gnocchi with sage brown butter and Parmigiano.',                   300.00, TRUE,  'Pasta',    12, FALSE),
(3115, 1010, 'Spinach Ricotta Ravioli',   'Handmade ravioli stuffed with spinach and ricotta.',                              320.00, TRUE,  'Pasta',    10, FALSE),
(3116, 1010, 'Cannoli',                   'Fried pastry shell with sweetened ricotta and pistachios. 2 pcs.',                150.00, TRUE,  'Dessert',  15, FALSE);

-- Creator 1011 â€” Gujarati Thali House (Gujarati) [3117-3128]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3117, 1011, 'Full Gujarati Thali',       '2 rotis, rice, dal, 2 sabjis, farsan, kadhi, raita, mithai.',                    200.00, TRUE,  'Thali',    20, FALSE),
(3118, 1011, 'Dhokla (8 pcs)',            'Steamed fermented chickpea batter. Light, spongy, tangy.',                         90.00, TRUE,  'Snack',    30, FALSE),
(3119, 1011, 'Fafda with Jalebi',         'Gram flour fried snack with fresh hot jalebi. Weekend breakfast.',                 80.00, TRUE,  'Breakfast',25, FALSE),
(3120, 1011, 'Khaman Dhokla (8 pcs)',     'Soft, yellow besan dhokla with mustard and green chilli tadka.',                   70.00, TRUE,  'Snack',    35, FALSE),
(3121, 1011, 'Undhiyu',                   'Winter mixed vegetable preparation with fenugreek dumplings.',                     180.00, TRUE,  'Main',     15, FALSE),
(3122, 1011, 'Thepla (6 pcs)',            'Spiced fenugreek flatbreads. Perfect travel food.',                                 90.00, TRUE,  'Bread',    30, FALSE),
(3123, 1011, 'Khandvi (12 pcs)',          'Thin rolled gram flour bites with coconut and sesame.',                            100.00, TRUE,  'Snack',    25, FALSE),
(3124, 1011, 'Dal Baati Churma',          'Baked wheat balls with dal and sweet churma. Rajasthani classic.',                250.00, TRUE,  'Main',     15, FALSE),
(3125, 1011, 'Puri Shak',                 'Fried wheat pooris with potato-tomato shak. 3 pooris.',                           120.00, TRUE,  'Main',     20, FALSE),
(3126, 1011, 'Moong Dal Halwa',           'Slow-cooked split mung lentil sweet with ghee and dry fruits.',                    90.00, TRUE,  'Dessert',  20, FALSE),
(3127, 1011, 'Ghevar',                    'Lattice fried sweet disc with rabdi and saffron. Festive.',                        200.00, TRUE,  'Dessert',  10, FALSE),
(3128, 1011, 'Jalebi (6 pcs)',            'Freshly fried crisp jalebi soaked in sugar syrup.',                               100.00, TRUE,  'Dessert',  25, FALSE);

-- Creator 1012 â€” Momos & More (Tibetan) [3129-3138]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3129, 1012, 'Steamed Veg Momos (10)',   'Cabbage and paneer filled steamed dumplings with red chutney.',                   120.00, TRUE,  'Dimsum',   30, FALSE),
(3130, 1012, 'Fried Chicken Momos (10)','Minced chicken momos deep fried until golden. Extra spicy dip.',                   150.00, FALSE, 'Dimsum',   25, FALSE),
(3131, 1012, 'Thukpa',                   'Tibetan noodle soup with vegetables and Himalayan spices.',                        180.00, TRUE,  'Soup',     20, FALSE),
(3132, 1012, 'Thenthuk',                 'Handmade pulled noodle soup. Hearty and warming.',                                 160.00, FALSE, 'Soup',     15, FALSE),
(3133, 1012, 'Pan Fried Momos (10)',     'Steamed then pan-fried. Crispy bottom, juicy inside.',                             140.00, TRUE,  'Dimsum',   25, FALSE),
(3134, 1012, 'Wonton Soup',              '8 wontons in clear bone broth with bok choy.',                                     150.00, FALSE, 'Soup',     15, FALSE),
(3135, 1012, 'Buffalo Momos (10)',       'Minced buffalo meat momos. Authentic flavour.',                                     130.00, FALSE, 'Dimsum',   20, FALSE),
(3136, 1012, 'Chocolate Momos (10)',     'Sweet dessert momos filled with nutella and banana. Fried.',                       160.00, TRUE,  'Dessert',  15, FALSE),
(3137, 1012, 'Jhol Momos (10)',          'Steamed momos dipped in a spiced soupy broth. Popular street style.',              140.00, TRUE,  'Dimsum',   25, FALSE),
(3138, 1012, 'C-Momos (10)',             'Crispy momos in a chilli sauce. Street food icon.',                                 130.00, TRUE,  'Dimsum',   20, FALSE);

-- Creator 1013 â€” Bake My Day (Goan Bakery) [3139-3150]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3139, 1013, 'Bebinca (slice)',           'Classic Goan 7-layer cake with coconut milk and ghee. Heirloom recipe.',          200.00, TRUE,  'Cake',     15, FALSE),
(3140, 1013, 'Dodol (slice)',             'Sticky rice cake with coconut and jaggery. Intensely sweet.',                     150.00, TRUE,  'Sweets',   15, FALSE),
(3141, 1013, 'Serradura',                 'Sawdust pudding with crushed Maria biscuits and cream. Chilled.',                 180.00, TRUE,  'Dessert',  20, FALSE),
(3142, 1013, 'Goan PÃ£o (2 pcs)',          'Crusty Goan bread rolls baked in a wood-fired oven.',                              60.00, TRUE,  'Bread',    30, FALSE),
(3143, 1013, 'Cocada (6 pcs)',            'Coconut sweet balls with jaggery. Traditional Goan confection.',                  120.00, TRUE,  'Sweets',   25, FALSE),
(3144, 1013, 'Bol de Coco',               'Whole coconut cake. Traditional Portuguese-Goan recipe.',                         250.00, TRUE,  'Cake',     10, FALSE),
(3145, 1013, 'Banana Cake (slice)',       'Moist banana cake with cinnamon cream cheese frosting.',                           180.00, TRUE,  'Cake',     15, FALSE),
(3146, 1013, 'Semolina Cake (slice)',     'Goan baath cake made with coconut and semolina.',                                  200.00, TRUE,  'Cake',     12, FALSE),
(3147, 1013, 'Choc Fudge Brownies (6)', 'Dense, fudgy brownies with sea salt caramel drizzle.',                              220.00, TRUE,  'Dessert',  20, FALSE),
(3148, 1013, 'Cashew Cookies (8 pcs)',   'Buttery cookies packed with whole Goan cashews.',                                  200.00, TRUE,  'Cookie',   25, FALSE),
(3149, 1013, 'Goan Christmas Cake (s.)', 'Dark fruit cake soaked in port wine. Year-round available.',                       280.00, TRUE,  'Cake',     10, FALSE),
(3150, 1013, 'Portuguese Egg Tarts (4)','Creamy custard tarts with a flaky shell. Served warm.',                             160.00, TRUE,  'Pastry',   20, FALSE);

-- Creator 1014 â€” Kerala Kitchen (Kerala) [3151-3162]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3151, 1014, 'Appam with Veg Stew',      'Lacy appam with coconut milk vegetable stew. 2 appam.',                           200.00, TRUE,  'Tiffin',   20, FALSE),
(3152, 1014, 'Kerala Fish Curry',         'Kodampuli-based fish curry. Best with rice. Serves 1.',                           280.00, FALSE, 'Main',     15, FALSE),
(3153, 1014, 'Prawn Curry',               'Coconut milk prawn curry with raw mango. Semi-thick.',                            320.00, FALSE, 'Main',     12, FALSE),
(3154, 1014, 'Puttu with Kadala Curry',  'Steamed rice cylinder with black chickpea curry.',                                 150.00, FALSE, 'Breakfast',20, FALSE),
(3155, 1014, 'Kerala Parotta Chicken',   'Layered Malabar parotta with spiced chicken fry. 2 parotta.',                     220.00, FALSE, 'Main',     20, FALSE),
(3156, 1014, 'Kerala Beef Fry',           'Dry-spiced slow-cooked beef with coconut slices.',                                280.00, FALSE, 'Main',     15, FALSE),
(3157, 1014, 'Mini Kerala Sadya',         '7-item sadya on banana leaf: rice, sambar, 3 sabjis, payasam, papadum.',          250.00, TRUE,  'Thali',    12, FALSE),
(3158, 1014, 'Kozhikodan Biryani',        'Malabar dum biryani with ghee-fried onions and dates.',                           300.00, FALSE, 'Biryani',  15, FALSE),
(3159, 1014, 'Karimeen Pollichathu',      'Pearl spot fish baked in banana leaf with spice paste.',                          350.00, FALSE, 'Main',     10, FALSE),
(3160, 1014, 'Erissery',                  'Pumpkin and red cowpea cooked with coconut and cumin.',                           130.00, TRUE,  'Side',     25, FALSE),
(3161, 1014, 'Avial',                     'Mixed vegetable with yogurt and coconut. 11 vegetables.',                         120.00, TRUE,  'Side',     25, FALSE),
(3162, 1014, 'Palada Payasam',            'Rice flakes cooked in milk with cardamom. Traditional dessert.',                  150.00, TRUE,  'Dessert',  20, FALSE);

-- Creator 1015 â€” Millet Magic (Healthy Meals) [3163-3172]
INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES
(3163, 1015, 'Ragi Dosa',                 'Finger millet crispy dosa with coconut chutney and sambar.',                      110.00, TRUE,  'Tiffin',   25, FALSE),
(3164, 1015, 'Jowar Roti (4 pcs)',        'Hand-rolled sorghum flatbreads with ghee. Gluten-free.',                           80.00, TRUE,  'Bread',    30, FALSE),
(3165, 1015, 'Bajra Khichdi',             'Pearl millet cooked with vegetables and tempered spices.',                         120.00, TRUE,  'Main',     20, FALSE),
(3166, 1015, 'Foxtail Millet Upma',       'Nutritious foxtail millet semolina with curry leaves.',                           100.00, TRUE,  'Breakfast',25, FALSE),
(3167, 1015, 'Kodo Millet Rice Bowl',     'Kodo millet with sambar and 2 sides. Wholesome meal.',                            130.00, TRUE,  'Bowl',     20, FALSE),
(3168, 1015, 'Ragi Ladoo (6 pcs)',        'Roasted finger millet ladoo with jaggery and ghee.',                              150.00, TRUE,  'Dessert',  25, FALSE),
(3169, 1015, 'Barnyard Millet Bowl',      'Samak rice bowl with lentils and roasted nuts.',                                  200.00, TRUE,  'Bowl',     15, FALSE),
(3170, 1015, 'Little Millet Pongal',      'Hearty little millet pongal with pepper and ghee.',                               110.00, TRUE,  'Breakfast',20, FALSE),
(3171, 1015, 'Kodo Millet Idli (6 pcs)','Soft steamed idlis with sambar and chutneys. Gluten-free.',                         120.00, TRUE,  'Tiffin',   25, FALSE),
(3172, 1015, 'Proso Millet Kheer',        'Creamy proso millet kheer with cardamom and dry fruits.',                         150.00, TRUE,  'Dessert',  20, FALSE);

-- ============================================================
-- SECTION 6: FOOD DROPS  [4001-4049]
-- Statuses: COMPLETED / CUTOFF / READY / OPEN / ANNOUNCED / DRAFT
-- ============================================================
INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time,
    pickup_location, pickup_time, max_orders, current_orders, status, drop_photo_url, special_notes)
VALUES
-- Creator 1001 — The Sourdough Story
(4001, 1001, 'Weekend Sourdough Batch #1',     'Fresh 72-hour sourdough and cinnamon rolls. Limited slots.',
    '2026-08-11', '2026-08-10 20:00:00', '12th Cross, Indiranagar, Bangalore', '10 AM – 12 PM', 15, 6,  'COMPLETED', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', 'Pre-order required.'),
(4002, 1001, 'Pastry Morning Drop',             'Croissants and pain au chocolat baked overnight.',
    '2026-08-18', '2026-08-17 20:00:00', '12th Cross, Indiranagar, Bangalore', '9 AM – 11 AM',  20, 6,  'COMPLETED', 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg', NULL),
(4003, 1001, 'Muffin & Banana Bread Day',       'Blueberry muffins, banana bread and biscotti.',
    '2026-08-25', '2026-08-24 20:00:00', '12th Cross, Indiranagar, Bangalore', '10 AM – 12 PM', 15, 5,  'COMPLETED', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', NULL),
(4004, 1001, 'Cake Saturday — Red Velvet',      'Whole cakes and slices ready for pickup.',
    '2026-09-10', '2026-09-09 20:00:00', '12th Cross, Indiranagar, Bangalore', '11 AM – 1 PM',  15, 8,  'READY',     'https://images.pexels.com/photos/1291712/pexels-photo-1291712.jpeg', 'Pickup confirmation will be sent.'),
(4005, 1001, 'Focaccia & Sourdough Pre-order',  'Rosemary focaccia and sourdough loaves.',
    '2026-09-12', '2026-09-11 20:00:00', '12th Cross, Indiranagar, Bangalore', '10 AM – 12 PM', 20, 5,  'OPEN',      'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', NULL),
(4006, 1001, 'Cheesecake & Cookie Box',         'NY cheesecake slices and chocolate chip cookies.',
    '2026-09-17', '2026-09-16 20:00:00', '12th Cross, Indiranagar, Bangalore', '11 AM – 1 PM',  25, 0,  'ANNOUNCED', 'https://images.pexels.com/photos/1291712/pexels-photo-1291712.jpeg', NULL),
-- Creator 1002 — Maa Ki Rasoi
(4007, 1002, 'Monday Tiffin — Dal Makhani',     'Dal makhani and fresh rotis. Pre-book to avoid missing out.',
    '2026-08-18', '2026-08-17 19:00:00', 'Lajpat Nagar Market, New Delhi',     '12 PM – 2 PM',  20, 6,  'COMPLETED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(4008, 1002, 'Comfort Khichdi Drop',            'Moong dal khichdi and rajma chawal. Desi comfort.',
    '2026-08-25', '2026-08-24 19:00:00', 'Lajpat Nagar Market, New Delhi',     '12 PM – 2 PM',  15, 5,  'COMPLETED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(4009, 1002, 'Paneer & Chole Tiffin',           'Paneer butter masala and chole bhature. Weekend special.',
    '2026-09-14', '2026-09-13 19:00:00', 'Lajpat Nagar Market, New Delhi',     '12 PM – 2 PM',  25, 3,  'OPEN',      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'Add raita for Rs 50 extra.'),
(4010, 1002, 'Rajasthani Thepla Special',       'Fresh methi thepla with aloo sabzi. Crispy and soft.',
    '2026-09-21', '2026-09-20 19:00:00', 'Lajpat Nagar Market, New Delhi',     '11 AM – 1 PM',  20, 0,  'ANNOUNCED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
-- Creator 1003 — Midnight Munchies (DRAFT, no public orders)
(4011, 1003, 'Late Night Burger Box',           'Classic and BBQ burgers. Coming soon.',
    '2026-09-20', '2026-09-19 22:00:00', 'Bandra West, Mumbai',                '10 PM – 12 AM', 20, 0,  'DRAFT',     NULL, NULL),
-- Creator 1004 — Sunday Biryani Club
(4012, 1004, 'Eid Special Biryani Drop',        'Mutton dum biryani with haleem and raita.',
    '2026-07-06', '2026-07-05 18:00:00', 'Jubilee Hills, Hyderabad',           '1 PM – 3 PM',   20, 8,  'COMPLETED', 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', 'Limited portions. One person one pot.'),
(4013, 1004, 'Sunday Classic — Chicken & Tikka', 'Chicken biryani, chicken tikka and seekh kebab platter.',
    '2026-07-20', '2026-07-19 18:00:00', 'Jubilee Hills, Hyderabad',           '1 PM – 3 PM',   25, 10, 'COMPLETED', 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', NULL),
(4014, 1004, 'Veg Biryani Sunday',              'Dum veg biryani with mirchi ka salan. Purely vegetarian.',
    '2026-08-03', '2026-08-02 18:00:00', 'Jubilee Hills, Hyderabad',           '1 PM – 3 PM',   20, 6,  'COMPLETED', 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', NULL),
(4015, 1004, 'This Sunday — Biryani Pre-order', 'Mutton + Chicken biryanis and raita.',
    '2026-09-14', '2026-09-13 18:00:00', 'Jubilee Hills, Hyderabad',           '1 PM – 3 PM',   25, 6,  'OPEN',      'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', 'Order by Saturday 6 PM.'),
(4016, 1004, 'Haleem & Kebab Weekend',          'Haleem, boti kebab and double ka meetha.',
    '2026-09-21', '2026-09-20 18:00:00', 'Jubilee Hills, Hyderabad',           '1 PM – 3 PM',   30, 0,  'ANNOUNCED', 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg', NULL),
-- Creator 1005 — Bombay Vada Pav
(4017, 1005, 'Vada Pav & Pav Bhaji Batch',      'Classic Vada Pav and buttery pav bhaji.',
    '2026-08-28', '2026-08-27 18:00:00', 'FC Road, Deccan Gymkhana, Pune',     '5 PM – 8 PM',   15, 4,  'COMPLETED', 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
(4018, 1005, 'Evening Chaat Drop',              'Vada pav, misal pav and bhel puri. Evening street food.',
    '2026-09-12', '2026-09-12 15:00:00', 'FC Road, Deccan Gymkhana, Pune',     '5 PM – 8 PM',   20, 3,  'OPEN',      'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
-- Creator 1006 — Keto Kitchen
(4019, 1006, 'Keto Monday Meal Prep',           'Keto salad bowl and bulletproof coffee.',
    '2026-08-25', '2026-08-24 20:00:00', 'HSR Layout Sector 2, Bangalore',     '8 AM – 10 AM',  12, 5,  'COMPLETED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'Macros sheet included.'),
(4020, 1006, 'Keto Breakfast Batch',            'Keto pancakes and avocado egg bowl.',
    '2026-09-01', '2026-08-31 20:00:00', 'HSR Layout Sector 2, Bangalore',     '8 AM – 10 AM',  15, 4,  'COMPLETED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(4021, 1006, 'Keto Lunch Box — This Week',      'Cauliflower rice and grilled chicken bowl.',
    '2026-09-12', '2026-09-11 20:00:00', 'HSR Layout Sector 2, Bangalore',     '12 PM – 2 PM',  20, 2,  'OPEN',      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(4022, 1006, 'Keto Baked Goodies Drop',         'Almond flour bread and keto fat bombs.',
    '2026-09-18', '2026-09-17 20:00:00', 'HSR Layout Sector 2, Bangalore',     '10 AM – 12 PM', 15, 0,  'ANNOUNCED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
-- Creator 1007 — Chennai Spice
(4023, 1007, 'Tiffin Morning — Dosa & Idli',    'Masala dosa and soft idlis with sambar.',
    '2026-08-24', '2026-08-23 20:00:00', 'T. Nagar, Chennai',                  '8 AM – 10 AM',  20, 6,  'COMPLETED', 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
(4024, 1007, 'Vada & Upma Morning',             'Crispy medu vada and hot upma.',
    '2026-09-01', '2026-08-31 20:00:00', 'T. Nagar, Chennai',                  '8 AM – 10 AM',  15, 5,  'COMPLETED', 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
(4025, 1007, 'Filter Coffee & Tiffin Box',      'Filter coffee, pongal and rava dosa.',
    '2026-09-13', '2026-09-12 20:00:00', 'T. Nagar, Chennai',                  '8 AM – 10 AM',  20, 2,  'OPEN',      'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
-- Creator 1008 — Bengali Sweets Corner
(4026, 1008, 'Misti Special — Rosogolla & More', 'Rosogolla, sandesh and mishti doi.',
    '2026-08-10', '2026-08-09 18:00:00', 'College Street, Kolkata',            '11 AM – 1 PM',  20, 8,  'COMPLETED', 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg', 'Earthen matka packaging.'),
(4027, 1008, 'Festival Sweets Box',             'Kaju barfi, rasgulla and chum chum.',
    '2026-08-24', '2026-08-23 18:00:00', 'College Street, Kolkata',            '11 AM – 1 PM',  25, 10, 'COMPLETED', 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg', NULL),
(4028, 1008, 'Autumn Misti Drop',              'Pantua, ladikeni and chomchom.',
    '2026-09-01', '2026-08-31 18:00:00', 'College Street, Kolkata',            '11 AM – 1 PM',  20, 7,  'COMPLETED', 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg', NULL),
(4029, 1008, 'Malai Chop & Sondesh — Ready',   'Malai chop and nolen gurer sondesh. Ready for pickup.',
    '2026-09-10', '2026-09-09 18:00:00', 'College Street, Kolkata',            '11 AM – 1 PM',  20, 8,  'READY',     'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg', 'Pickup: same day only.'),
(4030, 1008, 'Puja Special Sweets — Coming',   'Rosogolla and sandesh for Durga Puja season.',
    '2026-09-21', '2026-09-20 18:00:00', 'College Street, Kolkata',            '11 AM – 1 PM',  25, 0,  'ANNOUNCED', 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg', NULL),
-- Creator 1009 — Fit Bites
(4031, 1009, 'Detox Monday Bowls',              'Green detox salad and quinoa bowl.',
    '2026-09-01', '2026-08-31 20:00:00', 'Hauz Khas Village, New Delhi',       '12 PM – 2 PM',  15, 5,  'COMPLETED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(4032, 1009, 'Power Bowl Drop — This Week',     'Protein bowl, buddha bowl and power salad.',
    '2026-09-13', '2026-09-12 20:00:00', 'Hauz Khas Village, New Delhi',       '12 PM – 2 PM',  20, 2,  'OPEN',      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
-- Creator 1010 — The Pasta Bar
(4033, 1010, 'Pasta Wednesday — Carbonara',     'Spaghetti carbonara and bruschetta.',
    '2026-08-27', '2026-08-26 20:00:00', 'Bandra West, Mumbai',                '7 PM – 9 PM',   15, 5,  'COMPLETED', 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', NULL),
(4034, 1010, 'Penne Night & Garlic Bread',      'Penne arrabiata and cheesy garlic bread.',
    '2026-09-03', '2026-09-02 20:00:00', 'Bandra West, Mumbai',                '7 PM – 9 PM',   12, 4,  'COMPLETED', 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', NULL),
(4035, 1010, 'Friday Italian Night',            'Fettuccine alfredo and tiramisu.',
    '2026-09-12', '2026-09-11 20:00:00', 'Bandra West, Mumbai',                '7 PM – 9 PM',   20, 2,  'OPEN',      'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg', NULL),
-- Creator 1011 — Gujarati Thali House
(4036, 1011, 'Sunday Full Thali',               'Complete Gujarati thali with dhokla.',
    '2026-09-01', '2026-08-31 18:00:00', 'CG Road, Ahmedabad',                 '12 PM – 2 PM',  15, 4,  'COMPLETED', 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
(4037, 1011, 'Navratri Special — Fafda & Undhiyu', 'Fafda with jalebi and winter undhiyu.',
    '2026-09-21', '2026-09-20 18:00:00', 'CG Road, Ahmedabad',                 '10 AM – 12 PM', 20, 0,  'ANNOUNCED', 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
-- Creator 1012 — Momos & More
(4038, 1012, 'Weekend Momo Batch',              'Steamed veg momos and thukpa.',
    '2026-09-07', '2026-09-06 18:00:00', 'Laxmi Nagar, New Delhi',             '6 PM – 9 PM',   15, 3,  'COMPLETED', 'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
(4039, 1012, 'Fried & Jhol Momo Drop',          'Fried chicken momos and jhol momos.',
    '2026-09-14', '2026-09-13 18:00:00', 'Laxmi Nagar, New Delhi',             '6 PM – 9 PM',   20, 2,  'OPEN',      'https://images.pexels.com/photos/3629537/pexels-photo-3629537.jpeg', NULL),
-- Creator 1013 — Bake My Day (Goa)
(4040, 1013, 'Goan Heritage Sweets Box',        'Bebinca and dodol. Traditional Goan recipes.',
    '2026-08-31', '2026-08-30 18:00:00', 'Fontainhas, Panaji, Goa',            '10 AM – 1 PM',  15, 4,  'COMPLETED', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', NULL),
(4041, 1013, 'Pão & Banana Cake Morning',       'Fresh Goan pão bread and banana cake.',
    '2026-09-06', '2026-09-05 18:00:00', 'Fontainhas, Panaji, Goa',            '9 AM – 11 AM',  10, 3,  'COMPLETED', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', NULL),
(4042, 1013, 'Pastry Weekend — Serradura & Egg Tart', 'Serradura pudding, egg tarts and cashew cookies.',
    '2026-09-14', '2026-09-13 18:00:00', 'Fontainhas, Panaji, Goa',            '10 AM – 1 PM',  15, 2,  'OPEN',      'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg', NULL),
-- Creator 1014 — Kerala Kitchen
(4043, 1014, 'Onam Special — Fish Curry & Appam', 'Appam with veg stew and Kerala fish curry.',
    '2026-08-17', '2026-08-16 18:00:00', 'Koramangala 5th Block, Bangalore',   '11 AM – 1 PM',  20, 8,  'COMPLETED', 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg', 'Onam special packaging.'),
(4044, 1014, 'Kerala Breakfast Box',            'Puttu with kadala and Kerala beef fry.',
    '2026-08-31', '2026-08-30 18:00:00', 'Koramangala 5th Block, Bangalore',   '8 AM – 10 AM',  20, 6,  'COMPLETED', 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg', NULL),
(4045, 1014, 'Sadya Mini & Kozhikodan Biryani',  'Mini sadya and Malabar biryani.',
    '2026-09-07', '2026-09-06 18:00:00', 'Koramangala 5th Block, Bangalore',   '12 PM – 2 PM',  15, 5,  'COMPLETED', 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg', NULL),
(4046, 1014, 'Prawn Curry & Karimeen — Ready',  'Prawn curry and karimeen pollichathu. Ready for pickup.',
    '2026-09-10', '2026-09-09 18:00:00', 'Koramangala 5th Block, Bangalore',   '12 PM – 2 PM',  15, 6,  'READY',     'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg', 'Very limited. Pickup today only.'),
(4047, 1014, 'Appam & Parotta Weekend',         'Appam with stew, parotta with chicken and avial.',
    '2026-09-14', '2026-09-13 18:00:00', 'Koramangala 5th Block, Bangalore',   '12 PM – 2 PM',  20, 3,  'OPEN',      'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg', NULL),
-- Creator 1015 — Millet Magic
(4048, 1015, 'Millet Tiffin — Ragi & Jowar',   'Ragi dosa and jowar roti. Gluten-free goodness.',
    '2026-09-07', '2026-09-06 18:00:00', 'Madhapur, Hyderabad',                '9 AM – 11 AM',  12, 3,  'COMPLETED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL),
(4049, 1015, 'Ancient Grains Box — Coming Soon', 'Bajra khichdi and ragi ladoo.',
    '2026-09-21', '2026-09-20 18:00:00', 'Madhapur, Hyderabad',                '9 AM – 11 AM',  15, 0,  'ANNOUNCED', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', NULL);

-- ============================================================
-- SECTION 7: DROP ITEMS  [4501-4625]
-- (drop_id, item_id, quantity_available, quantity_ordered)
-- ============================================================
INSERT INTO drop_items (drop_item_id, drop_id, item_id, quantity_available, quantity_ordered) VALUES
-- Drop 4001 (Sourdough + Cinnamon Roll)
(4501, 4001, 3001, 20, 6),(4502, 4001, 3005, 20, 6),
-- Drop 4002 (Croissant + Pain au Chocolat)
(4503, 4002, 3002, 30, 6),(4504, 4002, 3012, 30, 6),
-- Drop 4003 (Muffin + Banana Bread + Biscotti)
(4505, 4003, 3003, 20, 5),(4506, 4003, 3006, 15, 5),(4507, 4003, 3008, 20, 5),
-- Drop 4004 (Red Velvet Cake + Brownie) — READY
(4508, 4004, 3007, 20, 8),(4509, 4004, 3004, 30, 8),
-- Drop 4005 (Focaccia + Sourdough) — OPEN
(4510, 4005, 3009, 20, 5),(4511, 4005, 3001, 20, 5),
-- Drop 4006 (Cheesecake + Cookies) — ANNOUNCED
(4512, 4006, 3011, 25, 0),(4513, 4006, 3010, 30, 0),
-- Drop 4007 (Dal Makhani + Roti Combo)
(4514, 4007, 3013, 25, 6),(4515, 4007, 3014, 25, 6),
-- Drop 4008 (Rajma Chawal + Khichdi)
(4516, 4008, 3015, 20, 5),(4517, 4008, 3018, 20, 5),
-- Drop 4009 (Paneer + Chole + Chapati) — OPEN
(4518, 4009, 3016, 30, 3),(4519, 4009, 3020, 25, 3),(4520, 4009, 3022, 40, 3),
-- Drop 4010 (Thepla + Aloo) — ANNOUNCED
(4521, 4010, 3021, 25, 0),(4522, 4010, 3017, 20, 0),
-- Drop 4011 (Burger + Fries) — DRAFT
(4523, 4011, 3025, 20, 0),(4524, 4011, 3026, 20, 0),
-- Drop 4012 (Mutton Biryani + Haleem + Raita)
(4525, 4012, 3035, 20, 8),(4526, 4012, 3041, 20, 8),(4527, 4012, 3043, 40, 8),
-- Drop 4013 (Chicken Biryani + Tikka + Seekh)
(4528, 4013, 3036, 30, 10),(4529, 4013, 3038, 20, 10),(4530, 4013, 3039, 20, 10),
-- Drop 4014 (Veg Biryani + Mirchi Ka Salan)
(4531, 4014, 3037, 20, 6),(4532, 4014, 3042, 20, 6),
-- Drop 4015 (Mutton + Chicken + Raita) — OPEN
(4533, 4015, 3035, 25, 6),(4534, 4015, 3036, 25, 6),(4535, 4015, 3043, 50, 6),
-- Drop 4016 (Haleem + Boti + Meetha) — ANNOUNCED
(4536, 4016, 3041, 30, 0),(4537, 4016, 3044, 25, 0),(4538, 4016, 3045, 30, 0),
-- Drop 4017 (Vada Pav + Pav Bhaji)
(4539, 4017, 3047, 30, 4),(4540, 4017, 3048, 20, 4),
-- Drop 4018 (Vada Pav + Misal + Bhel) — OPEN
(4541, 4018, 3047, 30, 3),(4542, 4018, 3049, 25, 3),(4543, 4018, 3050, 30, 3),
-- Drop 4019 (Keto Salad + Bulletproof Coffee)
(4544, 4019, 3057, 15, 5),(4545, 4019, 3058, 20, 5),
-- Drop 4020 (Keto Pancakes + Avocado Egg)
(4546, 4020, 3059, 15, 4),(4547, 4020, 3060, 12, 4),
-- Drop 4021 (Cauliflower Rice + Grilled Chicken) — OPEN
(4548, 4021, 3061, 20, 2),(4549, 4021, 3064, 15, 2),
-- Drop 4022 (Almond Flour Bread + Fat Bombs) — ANNOUNCED
(4550, 4022, 3067, 15, 0),(4551, 4022, 3066, 20, 0),
-- Drop 4023 (Masala Dosa + Idli Sambar)
(4552, 4023, 3069, 25, 6),(4553, 4023, 3070, 25, 6),
-- Drop 4024 (Medu Vada + Upma)
(4554, 4024, 3071, 20, 5),(4555, 4024, 3073, 20, 5),
-- Drop 4025 (Filter Coffee + Pongal + Rava Dosa) — OPEN
(4556, 4025, 3072, 40, 2),(4557, 4025, 3075, 20, 2),(4558, 4025, 3074, 20, 2),
-- Drop 4026 (Rosogolla + Sandesh + Mishti Doi)
(4559, 4026, 3081, 25, 8),(4560, 4026, 3082, 25, 8),(4561, 4026, 3083, 25, 8),
-- Drop 4027 (Kaju Barfi + Rasgulla + Chum Chum)
(4562, 4027, 3084, 20, 10),(4563, 4027, 3085, 25, 10),(4564, 4027, 3087, 20, 10),
-- Drop 4028 (Pantua + Ladikeni + Chomchom)
(4565, 4028, 3086, 20, 7),(4566, 4028, 3088, 20, 7),(4567, 4028, 3089, 20, 7),
-- Drop 4029 (Malai Chop + Sondesh) — READY
(4568, 4029, 3091, 20, 8),(4569, 4029, 3092, 20, 8),
-- Drop 4030 (Rosogolla + Sandesh) — ANNOUNCED
(4570, 4030, 3081, 25, 0),(4571, 4030, 3082, 25, 0),
-- Drop 4031 (Detox Salad + Quinoa)
(4572, 4031, 3093, 15, 5),(4573, 4031, 3094, 15, 5),
-- Drop 4032 (Protein Bowl + Buddha Bowl + Power Salad) — OPEN
(4574, 4032, 3095, 15, 2),(4575, 4032, 3097, 15, 2),(4576, 4032, 3103, 12, 2),
-- Drop 4033 (Carbonara + Bruschetta)
(4577, 4033, 3105, 15, 5),(4578, 4033, 3109, 15, 5),
-- Drop 4034 (Penne Arrabiata + Garlic Bread)
(4579, 4034, 3106, 15, 4),(4580, 4034, 3111, 20, 4),
-- Drop 4035 (Fettuccine + Tiramisu) — OPEN
(4581, 4035, 3107, 15, 2),(4582, 4035, 3110, 15, 2),
-- Drop 4036 (Thali + Dhokla)
(4583, 4036, 3117, 15, 4),(4584, 4036, 3118, 30, 4),
-- Drop 4037 (Fafda + Undhiyu) — ANNOUNCED
(4585, 4037, 3119, 20, 0),(4586, 4037, 3121, 15, 0),
-- Drop 4038 (Steamed Veg Momos + Thukpa)
(4587, 4038, 3129, 20, 3),(4588, 4038, 3131, 15, 3),
-- Drop 4039 (Fried Chicken Momos + Jhol Momos) — OPEN
(4589, 4039, 3130, 20, 2),(4590, 4039, 3137, 20, 2),
-- Drop 4040 (Bebinca + Dodol)
(4591, 4040, 3139, 15, 4),(4592, 4040, 3140, 15, 4),
-- Drop 4041 (Pão + Banana Cake)
(4593, 4041, 3142, 20, 3),(4594, 4041, 3145, 12, 3),
-- Drop 4042 (Serradura + Egg Tart + Cashew Cookies) — OPEN
(4595, 4042, 3141, 15, 2),(4596, 4042, 3150, 20, 2),(4597, 4042, 3148, 20, 2),
-- Drop 4043 (Appam + Fish Curry)
(4598, 4043, 3151, 20, 8),(4599, 4043, 3152, 15, 8),
-- Drop 4044 (Puttu Kadala + Beef Fry)
(4600, 4044, 3154, 20, 6),(4601, 4044, 3156, 15, 6),
-- Drop 4045 (Sadya + Biryani)
(4602, 4045, 3157, 12, 5),(4603, 4045, 3158, 12, 5),
-- Drop 4046 (Prawn Curry + Karimeen) — READY
(4604, 4046, 3153, 12, 6),(4605, 4046, 3159, 10, 6),
-- Drop 4047 (Appam + Parotta Chicken + Avial) — OPEN
(4606, 4047, 3151, 20, 3),(4607, 4047, 3155, 20, 3),(4608, 4047, 3161, 20, 3),
-- Drop 4048 (Ragi Dosa + Jowar Roti)
(4609, 4048, 3163, 15, 3),(4610, 4048, 3164, 15, 3),
-- Drop 4049 (Bajra Khichdi + Ragi Ladoo) — ANNOUNCED
(4611, 4049, 3165, 20, 0),(4612, 4049, 3168, 20, 0);

-- ============================================================
-- SECTION 8: CREATOR FOLLOWS
-- ============================================================
-- Creator 1001 followers (customers 2001-2025)
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2001,1001),(2002,1001),(2003,1001),(2004,1001),(2005,1001),
(2006,1001),(2007,1001),(2008,1001),(2009,1001),(2010,1001),
(2011,1001),(2012,1001),(2013,1001),(2014,1001),(2015,1001),
(2016,1001),(2017,1001),(2018,1001),(2019,1001),(2020,1001),
(2021,1001),(2022,1001),(2023,1001),(2024,1001),(2025,1001);

-- Creator 1002 followers (customers 2015-2026)
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2015,1002),(2016,1002),(2017,1002),(2018,1002),(2019,1002),(2020,1002),
(2021,1002),(2022,1002),(2023,1002),(2024,1002),(2025,1002),(2026,1002);

-- Creator 1004 followers (customers 2038-2050 + 2001-2005)
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2001,1004),(2002,1004),(2003,1004),(2004,1004),(2005,1004),
(2038,1004),(2039,1004),(2040,1004),(2041,1004),(2042,1004),
(2043,1004),(2044,1004),(2045,1004),(2046,1004),(2047,1004),
(2048,1004),(2049,1004),(2050,1004);

-- Creator 1005 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2001,1005),(2025,1005),(2038,1005),(2046,1005),(2030,1005);

-- Creator 1006 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2001,1006),(2002,1006),(2006,1006),(2011,1006),(2014,1006),
(2015,1006),(2016,1006),(2017,1006),(2018,1006),(2019,1006);

-- Creator 1007 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2001,1007),(2003,1007),(2007,1007),(2019,1007),(2020,1007),
(2021,1007),(2022,1007),(2025,1007);

-- Creator 1008 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2001,1008),(2003,1008),(2005,1008),(2007,1008),(2009,1008),
(2011,1008),(2013,1008),(2015,1008),(2017,1008),(2019,1008),
(2021,1008),(2023,1008),(2027,1008),(2029,1008),(2031,1008);

-- Creator 1009 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2002,1009),(2004,1009),(2006,1009),(2008,1009),(2010,1009),
(2012,1009),(2016,1009),(2020,1009);

-- Creator 1010 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2010,1010),(2012,1010),(2014,1010),(2016,1010),(2018,1010),
(2020,1010),(2022,1010),(2024,1010);

-- Creator 1011 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2025,1011),(2030,1011),(2035,1011),(2040,1011),(2045,1011);

-- Creator 1012 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2040,1012),(2041,1012),(2042,1012),(2043,1012);

-- Creator 1013 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2015,1013),(2025,1013),(2035,1013),(2045,1013),(2013,1013);

-- Creator 1014 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2002,1014),(2004,1014),(2006,1014),(2008,1014),(2010,1014),
(2012,1014),(2014,1014),(2016,1014),(2018,1014),(2020,1014),
(2022,1014),(2024,1014);

-- Creator 1015 followers
INSERT INTO creator_follows (follower_id, creator_id) VALUES
(2030,1015),(2040,1015),(2045,1015),(2050,1015);

-- ============================================================
-- SECTION 9: ORDERS  [5001-5229]
-- Statuses: PLACED / PREPARING / READY / COMPLETED / CANCELLED
-- PaymentMethod: CASH / UPI / CARD
-- ============================================================
INSERT INTO orders (order_id, user_id, restaurant_id, drop_id, order_status, total_amount, payment_method, pickup_time, special_instructions, order_date) VALUES
-- === DROP 4001 (Sourdough Batch #1 — COMPLETED) ===
(5001, 2001, 1001, 4001, 'COMPLETED', 700.00, 'UPI',  '10:00 AM', NULL,                      '2026-08-11 10:15:00'),
(5002, 2002, 1001, 4001, 'COMPLETED', 280.00, 'CASH', '10:30 AM', NULL,                      '2026-08-10 20:30:00'),
(5003, 2003, 1001, 4001, 'COMPLETED', 540.00, 'UPI',  '11:00 AM', 'Extra packaging please.', '2026-08-10 21:00:00'),
(5004, 2004, 1001, 4001, 'COMPLETED', 360.00, 'UPI',  '10:15 AM', NULL,                      '2026-08-10 21:30:00'),
(5005, 2005, 1001, 4001, 'COMPLETED', 280.00, 'CARD', '11:30 AM', NULL,                      '2026-08-10 22:00:00'),
(5006, 2006, 1001, 4001, 'CANCELLED', 560.00, 'UPI',  '10:00 AM', NULL,                      '2026-08-10 22:30:00'),
-- === DROP 4002 (Pastry Morning — COMPLETED) ===
(5007, 2007, 1001, 4002, 'COMPLETED', 480.00, 'UPI',  '9:30 AM',  NULL,                      '2026-08-18 09:45:00'),
(5008, 2008, 1001, 4002, 'COMPLETED', 315.00, 'CASH', '10:00 AM', NULL,                      '2026-08-17 21:00:00'),
(5009, 2009, 1001, 4002, 'COMPLETED', 480.00, 'UPI',  '10:30 AM', 'Gift wrap needed.',        '2026-08-17 21:30:00'),
(5010, 2010, 1001, 4002, 'COMPLETED', 150.00, 'CASH', '9:00 AM',  NULL,                      '2026-08-17 22:00:00'),
(5011, 2011, 1001, 4002, 'COMPLETED', 315.00, 'UPI',  '9:30 AM',  NULL,                      '2026-08-17 22:30:00'),
(5012, 2012, 1001, 4002, 'COMPLETED', 150.00, 'CARD', '10:00 AM', NULL,                      '2026-08-17 23:00:00'),
-- === DROP 4003 (Muffin & Banana Bread — COMPLETED) ===
(5013, 2013, 1001, 4003, 'COMPLETED', 480.00, 'UPI',  '10:00 AM', NULL,                      '2026-08-25 10:15:00'),
(5014, 2014, 1001, 4003, 'COMPLETED', 360.00, 'CASH', '11:00 AM', NULL,                      '2026-08-24 21:00:00'),
(5015, 2015, 1001, 4003, 'COMPLETED', 240.00, 'UPI',  '10:30 AM', NULL,                      '2026-08-24 21:30:00'),
(5016, 2016, 1001, 4003, 'CANCELLED', 180.00, 'UPI',  '10:00 AM', NULL,                      '2026-08-24 22:00:00'),
(5017, 2017, 1001, 4003, 'COMPLETED', 360.00, 'CARD', '11:30 AM', NULL,                      '2026-08-24 22:30:00'),
-- === DROP 4004 (Cake Saturday — READY) ===
(5018, 2001, 1001, 4004, 'READY',     600.00, 'UPI',  '11:00 AM', NULL,                      '2026-09-09 21:00:00'),
(5019, 2002, 1001, 4004, 'READY',     700.00, 'CASH', '11:30 AM', NULL,                      '2026-09-09 21:30:00'),
(5020, 2003, 1001, 4004, 'PREPARING', 400.00, 'UPI',  '12:00 PM', NULL,                      '2026-09-09 22:00:00'),
(5021, 2004, 1001, 4004, 'PREPARING', 550.00, 'CARD', '11:00 AM', 'Birthday cake please.',   '2026-09-09 22:30:00'),
(5022, 2005, 1001, 4004, 'PLACED',    300.00, 'UPI',  '12:30 PM', NULL,                      '2026-09-09 23:00:00'),
(5023, 2006, 1001, 4004, 'PLACED',    800.00, 'CARD', '12:00 PM', NULL,                      '2026-09-09 23:30:00'),
(5024, 2007, 1001, 4004, 'PLACED',    400.00, 'UPI',  '11:30 AM', NULL,                      '2026-09-10 00:00:00'),
(5025, 2008, 1001, 4004, 'PLACED',    300.00, 'CASH', '12:00 PM', NULL,                      '2026-09-10 00:30:00'),
-- === DROP 4005 (Focaccia & Sourdough — OPEN) ===
(5026, 2009, 1001, 4005, 'PLACED',    500.00, 'UPI',  '10:00 AM', NULL,                      '2026-09-11 21:30:00'),
(5027, 2010, 1001, 4005, 'PLACED',    440.00, 'CASH', '11:00 AM', NULL,                      '2026-09-11 22:00:00'),
(5028, 2011, 1001, 4005, 'PLACED',    220.00, 'UPI',  '10:30 AM', NULL,                      '2026-09-11 22:30:00'),
(5029, 2012, 1001, 4005, 'PLACED',    500.00, 'CARD', '10:00 AM', NULL,                      '2026-09-11 23:00:00'),
(5030, 2013, 1001, 4005, 'PLACED',    280.00, 'UPI',  '11:30 AM', NULL,                      '2026-09-11 23:30:00'),
-- === DROP 4007 (Maa Ki Rasoi — Dal Makhani COMPLETED) ===
(5031, 2015, 1002, 4007, 'COMPLETED', 280.00, 'UPI',  '12:00 PM', NULL,                      '2026-08-18 12:30:00'),
(5032, 2016, 1002, 4007, 'COMPLETED', 200.00, 'CASH', '12:30 PM', NULL,                      '2026-08-17 19:30:00'),
(5033, 2017, 1002, 4007, 'COMPLETED', 240.00, 'UPI',  '1:00 PM',  NULL,                      '2026-08-17 20:00:00'),
(5034, 2018, 1002, 4007, 'COMPLETED', 150.00, 'CASH', '12:00 PM', NULL,                      '2026-08-17 20:30:00'),
(5035, 2019, 1002, 4007, 'COMPLETED', 280.00, 'UPI',  '12:30 PM', NULL,                      '2026-08-17 21:00:00'),
(5036, 2020, 1002, 4007, 'COMPLETED', 240.00, 'CARD', '1:00 PM',  NULL,                      '2026-08-17 21:30:00'),
-- === DROP 4008 (Khichdi Drop COMPLETED) ===
(5037, 2021, 1002, 4008, 'COMPLETED', 260.00, 'UPI',  '12:00 PM', NULL,                      '2026-08-25 12:30:00'),
(5038, 2022, 1002, 4008, 'COMPLETED', 200.00, 'CASH', '12:30 PM', NULL,                      '2026-08-24 19:30:00'),
(5039, 2023, 1002, 4008, 'COMPLETED', 130.00, 'UPI',  '1:00 PM',  NULL,                      '2026-08-24 20:00:00'),
(5040, 2024, 1002, 4008, 'COMPLETED', 260.00, 'UPI',  '12:00 PM', NULL,                      '2026-08-24 20:30:00'),
(5041, 2025, 1002, 4008, 'COMPLETED', 200.00, 'CASH', '12:30 PM', NULL,                      '2026-08-24 21:00:00'),
-- === DROP 4009 (Paneer & Chole — OPEN) ===
(5042, 2015, 1002, 4009, 'PLACED',    280.00, 'UPI',  '12:00 PM', NULL,                      '2026-09-13 19:30:00'),
(5043, 2018, 1002, 4009, 'PLACED',    420.00, 'CASH', '12:30 PM', NULL,                      '2026-09-13 20:00:00'),
(5044, 2020, 1002, 4009, 'PLACED',    230.00, 'UPI',  '1:00 PM',  NULL,                      '2026-09-13 20:30:00'),
-- === DROP 4012 (Sunday Biryani — Eid COMPLETED) ===
(5045, 2038, 1004, 4012, 'COMPLETED', 700.00, 'UPI',  '1:00 PM',  NULL,                      '2026-07-06 13:30:00'),
(5046, 2039, 1004, 4012, 'COMPLETED', 610.00, 'CASH', '1:30 PM',  NULL,                      '2026-07-05 18:30:00'),
(5047, 2040, 1004, 4012, 'COMPLETED', 410.00, 'UPI',  '2:00 PM',  NULL,                      '2026-07-05 19:00:00'),
(5048, 2041, 1004, 4012, 'COMPLETED', 350.00, 'CARD', '1:00 PM',  NULL,                      '2026-07-05 19:30:00'),
(5049, 2042, 1004, 4012, 'COMPLETED', 700.00, 'UPI',  '1:30 PM',  'Mutton only.',             '2026-07-05 20:00:00'),
(5050, 2043, 1004, 4012, 'COMPLETED', 410.00, 'CASH', '2:00 PM',  NULL,                      '2026-07-05 20:30:00'),
(5051, 2044, 1004, 4012, 'COMPLETED', 610.00, 'UPI',  '1:00 PM',  NULL,                      '2026-07-05 21:00:00'),
(5052, 2045, 1004, 4012, 'CANCELLED', 350.00, 'UPI',  '1:30 PM',  NULL,                      '2026-07-05 21:30:00'),
-- === DROP 4013 (Chicken Biryani Sunday — COMPLETED) ===
(5053, 2001, 1004, 4013, 'COMPLETED', 710.00, 'UPI',  '1:00 PM',  NULL,                      '2026-07-20 13:30:00'),
(5054, 2002, 1004, 4013, 'COMPLETED', 530.00, 'CASH', '1:30 PM',  NULL,                      '2026-07-19 18:30:00'),
(5055, 2003, 1004, 4013, 'COMPLETED', 280.00, 'UPI',  '2:00 PM',  NULL,                      '2026-07-19 19:00:00'),
(5056, 2004, 1004, 4013, 'COMPLETED', 450.00, 'CARD', '1:00 PM',  NULL,                      '2026-07-19 19:30:00'),
(5057, 2005, 1004, 4013, 'COMPLETED', 710.00, 'UPI',  '1:30 PM',  NULL,                      '2026-07-19 20:00:00'),
(5058, 2046, 1004, 4013, 'COMPLETED', 530.00, 'CASH', '2:00 PM',  NULL,                      '2026-07-19 20:30:00'),
(5059, 2047, 1004, 4013, 'COMPLETED', 280.00, 'UPI',  '1:00 PM',  NULL,                      '2026-07-19 21:00:00'),
(5060, 2048, 1004, 4013, 'COMPLETED', 450.00, 'CARD', '1:30 PM',  NULL,                      '2026-07-19 21:30:00'),
(5061, 2049, 1004, 4013, 'COMPLETED', 280.00, 'UPI',  '2:00 PM',  NULL,                      '2026-07-19 22:00:00'),
(5062, 2050, 1004, 4013, 'COMPLETED', 530.00, 'CASH', '1:00 PM',  NULL,                      '2026-07-19 22:30:00'),
-- === DROP 4014 (Veg Biryani Sunday — COMPLETED) ===
(5063, 2038, 1004, 4014, 'COMPLETED', 320.00, 'UPI',  '1:00 PM',  NULL,                      '2026-08-03 13:30:00'),
(5064, 2039, 1004, 4014, 'COMPLETED', 320.00, 'UPI',  '1:30 PM',  NULL,                      '2026-08-02 18:30:00'),
(5065, 2040, 1004, 4014, 'COMPLETED', 220.00, 'CASH', '2:00 PM',  NULL,                      '2026-08-02 19:00:00'),
(5066, 2041, 1004, 4014, 'COMPLETED', 220.00, 'CASH', '1:00 PM',  NULL,                      '2026-08-02 19:30:00'),
(5067, 2042, 1004, 4014, 'COMPLETED', 320.00, 'UPI',  '1:30 PM',  NULL,                      '2026-08-02 20:00:00'),
(5068, 2043, 1004, 4014, 'CANCELLED', 220.00, 'UPI',  '2:00 PM',  NULL,                      '2026-08-02 20:30:00'),
-- === DROP 4015 (This Sunday — Biryani — OPEN) ===
(5069, 2001, 1004, 4015, 'PLACED',    630.00, 'UPI',  '1:00 PM',  NULL,                      '2026-09-13 18:30:00'),
(5070, 2002, 1004, 4015, 'PLACED',    350.00, 'CASH', '1:30 PM',  NULL,                      '2026-09-13 19:00:00'),
(5071, 2003, 1004, 4015, 'PLACED',    630.00, 'UPI',  '2:00 PM',  NULL,                      '2026-09-13 19:30:00'),
(5072, 2004, 1004, 4015, 'PLACED',    410.00, 'CARD', '1:00 PM',  NULL,                      '2026-09-13 20:00:00'),
(5073, 2047, 1004, 4015, 'PLACED',    280.00, 'UPI',  '1:30 PM',  NULL,                      '2026-09-13 20:30:00'),
(5074, 2048, 1004, 4015, 'PLACED',    350.00, 'CASH', '2:00 PM',  NULL,                      '2026-09-13 21:00:00'),
-- === DROP 4017 (Vada Pav & Pav Bhaji — COMPLETED) ===
(5075, 2001, 1005, 4017, 'COMPLETED', 180.00, 'CASH', '5:30 PM',  NULL,                      '2026-08-28 17:45:00'),
(5076, 2025, 1005, 4017, 'COMPLETED', 120.00, 'UPI',  '6:00 PM',  NULL,                      '2026-08-27 18:30:00'),
(5077, 2038, 1005, 4017, 'COMPLETED', 60.00,  'CASH', '7:00 PM',  NULL,                      '2026-08-27 19:00:00'),
(5078, 2046, 1005, 4017, 'COMPLETED', 180.00, 'UPI',  '6:30 PM',  NULL,                      '2026-08-27 19:30:00'),
-- === DROP 4018 (Evening Chaat Drop — OPEN) ===
(5079, 2001, 1005, 4018, 'PLACED',    230.00, 'CASH', '5:30 PM',  NULL,                      '2026-09-12 15:30:00'),
(5080, 2030, 1005, 4018, 'PLACED',    190.00, 'UPI',  '6:00 PM',  NULL,                      '2026-09-12 16:00:00'),
(5081, 2038, 1005, 4018, 'PLACED',    150.00, 'CASH', '6:30 PM',  NULL,                      '2026-09-12 16:30:00'),
-- === DROP 4019 (Keto Monday — COMPLETED) ===
(5082, 2001, 1006, 4019, 'COMPLETED', 400.00, 'UPI',  '8:30 AM',  NULL,                      '2026-08-25 08:45:00'),
(5083, 2002, 1006, 4019, 'COMPLETED', 400.00, 'UPI',  '9:00 AM',  NULL,                      '2026-08-24 20:30:00'),
(5084, 2006, 1006, 4019, 'COMPLETED', 250.00, 'CASH', '8:30 AM',  'No nuts please.',         '2026-08-24 21:00:00'),
(5085, 2011, 1006, 4019, 'COMPLETED', 400.00, 'CARD', '9:00 AM',  NULL,                      '2026-08-24 21:30:00'),
(5086, 2014, 1006, 4019, 'COMPLETED', 400.00, 'UPI',  '9:30 AM',  NULL,                      '2026-08-24 22:00:00'),
-- === DROP 4020 (Keto Breakfast Batch — COMPLETED) ===
(5087, 2015, 1006, 4020, 'COMPLETED', 400.00, 'UPI',  '8:30 AM',  NULL,                      '2026-09-01 08:45:00'),
(5088, 2016, 1006, 4020, 'COMPLETED', 480.00, 'CASH', '9:00 AM',  NULL,                      '2026-08-31 20:30:00'),
(5089, 2017, 1006, 4020, 'COMPLETED', 200.00, 'UPI',  '8:30 AM',  NULL,                      '2026-08-31 21:00:00'),
(5090, 2018, 1006, 4020, 'COMPLETED', 400.00, 'CARD', '9:30 AM',  NULL,                      '2026-08-31 21:30:00'),
-- === DROP 4021 (Keto Lunch Box — OPEN) ===
(5091, 2001, 1006, 4021, 'PLACED',    450.00, 'UPI',  '12:00 PM', NULL,                      '2026-09-11 20:30:00'),
(5092, 2002, 1006, 4021, 'PLACED',    450.00, 'CASH', '12:30 PM', NULL,                      '2026-09-11 21:00:00'),
-- === DROP 4023 (Dosa & Idli Morning — COMPLETED) ===
(5093, 2001, 1007, 4023, 'COMPLETED', 220.00, 'CASH', '8:30 AM',  NULL,                      '2026-08-24 08:45:00'),
(5094, 2003, 1007, 4023, 'COMPLETED', 200.00, 'UPI',  '9:00 AM',  NULL,                      '2026-08-23 20:30:00'),
(5095, 2007, 1007, 4023, 'COMPLETED', 120.00, 'CASH', '8:30 AM',  NULL,                      '2026-08-23 21:00:00'),
(5096, 2019, 1007, 4023, 'COMPLETED', 200.00, 'UPI',  '9:00 AM',  NULL,                      '2026-08-23 21:30:00'),
(5097, 2020, 1007, 4023, 'COMPLETED', 220.00, 'CARD', '9:30 AM',  NULL,                      '2026-08-23 22:00:00'),
(5098, 2021, 1007, 4023, 'COMPLETED', 120.00, 'CASH', '8:30 AM',  NULL,                      '2026-08-23 22:30:00'),
-- === DROP 4024 (Vada & Upma — COMPLETED) ===
(5099, 2003, 1007, 4024, 'COMPLETED', 180.00, 'UPI',  '8:30 AM',  NULL,                      '2026-09-01 08:45:00'),
(5100, 2007, 1007, 4024, 'COMPLETED', 100.00, 'CASH', '9:00 AM',  NULL,                      '2026-08-31 20:30:00'),
(5101, 2019, 1007, 4024, 'COMPLETED', 160.00, 'UPI',  '8:30 AM',  NULL,                      '2026-08-31 21:00:00'),
(5102, 2022, 1007, 4024, 'COMPLETED', 180.00, 'CARD', '9:30 AM',  NULL,                      '2026-08-31 21:30:00'),
(5103, 2025, 1007, 4024, 'COMPLETED', 100.00, 'CASH', '9:00 AM',  NULL,                      '2026-08-31 22:00:00'),
-- === DROP 4025 (Filter Coffee & Tiffin — OPEN) ===
(5104, 2001, 1007, 4025, 'PLACED',    250.00, 'CASH', '8:30 AM',  NULL,                      '2026-09-12 20:30:00'),
(5105, 2021, 1007, 4025, 'PLACED',    250.00, 'UPI',  '9:00 AM',  NULL,                      '2026-09-12 21:00:00'),
-- === DROP 4026 (Bengali Sweets — Misti Special COMPLETED) ===
(5106, 2001, 1008, 4026, 'COMPLETED', 420.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-10 11:45:00'),
(5107, 2003, 1008, 4026, 'COMPLETED', 240.00, 'CASH', '12:00 PM', NULL,                      '2026-08-09 18:30:00'),
(5108, 2005, 1008, 4026, 'COMPLETED', 100.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-09 19:00:00'),
(5109, 2007, 1008, 4026, 'COMPLETED', 380.00, 'CASH', '12:00 PM', NULL,                      '2026-08-09 19:30:00'),
(5110, 2009, 1008, 4026, 'COMPLETED', 240.00, 'CARD', '12:30 PM', NULL,                      '2026-08-09 20:00:00'),
(5111, 2011, 1008, 4026, 'COMPLETED', 380.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-09 20:30:00'),
(5112, 2013, 1008, 4026, 'COMPLETED', 420.00, 'CASH', '12:00 PM', NULL,                      '2026-08-09 21:00:00'),
(5113, 2015, 1008, 4026, 'COMPLETED', 100.00, 'UPI',  '12:30 PM', NULL,                      '2026-08-09 21:30:00'),
-- === DROP 4027 (Festival Sweets — COMPLETED) ===
(5114, 2001, 1008, 4027, 'COMPLETED', 680.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-24 11:45:00'),
(5115, 2003, 1008, 4027, 'COMPLETED', 480.00, 'CASH', '12:00 PM', NULL,                      '2026-08-23 18:30:00'),
(5116, 2005, 1008, 4027, 'COMPLETED', 550.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-23 19:00:00'),
(5117, 2007, 1008, 4027, 'COMPLETED', 350.00, 'CASH', '12:00 PM', NULL,                      '2026-08-23 19:30:00'),
(5118, 2009, 1008, 4027, 'COMPLETED', 680.00, 'CARD', '12:30 PM', 'Gift box please.',         '2026-08-23 20:00:00'),
(5119, 2013, 1008, 4027, 'COMPLETED', 480.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-23 20:30:00'),
(5120, 2017, 1008, 4027, 'COMPLETED', 480.00, 'CASH', '12:00 PM', NULL,                      '2026-08-23 21:00:00'),
(5121, 2019, 1008, 4027, 'COMPLETED', 350.00, 'UPI',  '12:30 PM', NULL,                      '2026-08-23 21:30:00'),
(5122, 2021, 1008, 4027, 'COMPLETED', 550.00, 'CASH', '11:30 AM', NULL,                      '2026-08-23 22:00:00'),
(5123, 2023, 1008, 4027, 'COMPLETED', 350.00, 'UPI',  '12:00 PM', NULL,                      '2026-08-23 22:30:00'),
-- === DROP 4028 (Autumn Misti — COMPLETED) ===
(5124, 2001, 1008, 4028, 'COMPLETED', 490.00, 'UPI',  '11:30 AM', NULL,                      '2026-09-01 11:45:00'),
(5125, 2003, 1008, 4028, 'COMPLETED', 340.00, 'CASH', '12:00 PM', NULL,                      '2026-08-31 18:30:00'),
(5126, 2005, 1008, 4028, 'COMPLETED', 490.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-31 19:00:00'),
(5127, 2007, 1008, 4028, 'COMPLETED', 340.00, 'CASH', '12:00 PM', NULL,                      '2026-08-31 19:30:00'),
(5128, 2009, 1008, 4028, 'COMPLETED', 490.00, 'CARD', '12:30 PM', NULL,                      '2026-08-31 20:00:00'),
(5129, 2011, 1008, 4028, 'COMPLETED', 340.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-31 20:30:00'),
(5130, 2013, 1008, 4028, 'CANCELLED', 490.00, 'UPI',  '12:00 PM', NULL,                      '2026-08-31 21:00:00'),
-- === DROP 4029 (Malai Chop & Sondesh — READY) ===
(5131, 2001, 1008, 4029, 'READY',     400.00, 'UPI',  '11:30 AM', NULL,                      '2026-09-09 18:30:00'),
(5132, 2003, 1008, 4029, 'READY',     360.00, 'CASH', '12:00 PM', NULL,                      '2026-09-09 19:00:00'),
(5133, 2005, 1008, 4029, 'PREPARING', 400.00, 'UPI',  '11:30 AM', NULL,                      '2026-09-09 19:30:00'),
(5134, 2007, 1008, 4029, 'PREPARING', 360.00, 'CASH', '12:00 PM', NULL,                      '2026-09-09 20:00:00'),
(5135, 2009, 1008, 4029, 'PLACED',    400.00, 'CARD', '12:30 PM', NULL,                      '2026-09-09 20:30:00'),
(5136, 2011, 1008, 4029, 'PLACED',    400.00, 'UPI',  '11:30 AM', NULL,                      '2026-09-09 21:00:00'),
(5137, 2013, 1008, 4029, 'PLACED',    360.00, 'CASH', '12:00 PM', NULL,                      '2026-09-09 21:30:00'),
(5138, 2015, 1008, 4029, 'PLACED',    400.00, 'UPI',  '12:30 PM', NULL,                      '2026-09-09 22:00:00'),
-- === DROP 4031 (Detox Monday — COMPLETED) ===
(5139, 2002, 1009, 4031, 'COMPLETED', 530.00, 'UPI',  '12:00 PM', NULL,                      '2026-09-01 12:15:00'),
(5140, 2004, 1009, 4031, 'COMPLETED', 530.00, 'UPI',  '12:30 PM', NULL,                      '2026-08-31 20:30:00'),
(5141, 2006, 1009, 4031, 'COMPLETED', 250.00, 'CASH', '1:00 PM',  NULL,                      '2026-08-31 21:00:00'),
(5142, 2008, 1009, 4031, 'COMPLETED', 280.00, 'UPI',  '12:00 PM', NULL,                      '2026-08-31 21:30:00'),
(5143, 2010, 1009, 4031, 'COMPLETED', 530.00, 'CARD', '12:30 PM', NULL,                      '2026-08-31 22:00:00'),
-- === DROP 4032 (Power Bowls — OPEN) ===
(5144, 2002, 1009, 4032, 'PLACED',    570.00, 'UPI',  '12:00 PM', NULL,                      '2026-09-12 20:30:00'),
(5145, 2012, 1009, 4032, 'PLACED',    320.00, 'CASH', '12:30 PM', NULL,                      '2026-09-12 21:00:00'),
-- === DROP 4033 (Pasta Carbonara — COMPLETED) ===
(5146, 2010, 1010, 4033, 'COMPLETED', 500.00, 'UPI',  '7:30 PM',  NULL,                      '2026-08-27 19:45:00'),
(5147, 2012, 1010, 4033, 'COMPLETED', 500.00, 'UPI',  '8:00 PM',  NULL,                      '2026-08-26 20:30:00'),
(5148, 2014, 1010, 4033, 'COMPLETED', 350.00, 'CASH', '7:30 PM',  NULL,                      '2026-08-26 21:00:00'),
(5149, 2016, 1010, 4033, 'COMPLETED', 350.00, 'CARD', '8:00 PM',  NULL,                      '2026-08-26 21:30:00'),
(5150, 2018, 1010, 4033, 'COMPLETED', 500.00, 'UPI',  '8:30 PM',  NULL,                      '2026-08-26 22:00:00'),
-- === DROP 4034 (Penne Night — COMPLETED) ===
(5151, 2010, 1010, 4034, 'COMPLETED', 380.00, 'UPI',  '7:30 PM',  NULL,                      '2026-09-03 19:45:00'),
(5152, 2012, 1010, 4034, 'COMPLETED', 280.00, 'CASH', '8:00 PM',  NULL,                      '2026-09-02 20:30:00'),
(5153, 2014, 1010, 4034, 'COMPLETED', 380.00, 'UPI',  '7:30 PM',  NULL,                      '2026-09-02 21:00:00'),
(5154, 2016, 1010, 4034, 'COMPLETED', 280.00, 'CARD', '8:30 PM',  NULL,                      '2026-09-02 21:30:00'),
-- === DROP 4035 (Friday Italian Night — OPEN) ===
(5155, 2010, 1010, 4035, 'PLACED',    520.00, 'UPI',  '7:00 PM',  NULL,                      '2026-09-11 20:30:00'),
(5156, 2018, 1010, 4035, 'PLACED',    520.00, 'CASH', '7:30 PM',  NULL,                      '2026-09-11 21:00:00'),
-- === DROP 4036 (Gujarati Thali — COMPLETED) ===
(5157, 2025, 1011, 4036, 'COMPLETED', 290.00, 'CASH', '12:00 PM', NULL,                      '2026-09-01 12:15:00'),
(5158, 2030, 1011, 4036, 'COMPLETED', 200.00, 'UPI',  '12:30 PM', NULL,                      '2026-08-31 18:30:00'),
(5159, 2035, 1011, 4036, 'COMPLETED', 200.00, 'CASH', '1:00 PM',  NULL,                      '2026-08-31 19:00:00'),
(5160, 2040, 1011, 4036, 'COMPLETED', 290.00, 'UPI',  '12:00 PM', NULL,                      '2026-08-31 19:30:00'),
-- === DROP 4038 (Weekend Momo Batch — COMPLETED) ===
(5161, 2040, 1012, 4038, 'COMPLETED', 300.00, 'UPI',  '6:30 PM',  NULL,                      '2026-09-07 18:45:00'),
(5162, 2041, 1012, 4038, 'COMPLETED', 300.00, 'CASH', '7:00 PM',  NULL,                      '2026-09-06 18:30:00'),
(5163, 2042, 1012, 4038, 'COMPLETED', 180.00, 'UPI',  '6:30 PM',  NULL,                      '2026-09-06 19:00:00'),
-- === DROP 4039 (Fried Momo Drop — OPEN) ===
(5164, 2040, 1012, 4039, 'PLACED',    290.00, 'UPI',  '6:30 PM',  NULL,                      '2026-09-13 18:30:00'),
(5165, 2043, 1012, 4039, 'PLACED',    270.00, 'CASH', '7:00 PM',  NULL,                      '2026-09-13 19:00:00'),
-- === DROP 4040 (Goan Heritage Sweets — COMPLETED) ===
(5166, 2015, 1013, 4040, 'COMPLETED', 350.00, 'UPI',  '10:30 AM', NULL,                      '2026-08-31 10:45:00'),
(5167, 2025, 1013, 4040, 'COMPLETED', 300.00, 'CASH', '11:00 AM', NULL,                      '2026-08-30 18:30:00'),
(5168, 2035, 1013, 4040, 'COMPLETED', 200.00, 'UPI',  '10:30 AM', NULL,                      '2026-08-30 19:00:00'),
(5169, 2045, 1013, 4040, 'COMPLETED', 350.00, 'CARD', '11:00 AM', NULL,                      '2026-08-30 19:30:00'),
-- === DROP 4041 (Pão & Banana Cake — COMPLETED) ===
(5170, 2013, 1013, 4041, 'COMPLETED', 240.00, 'CASH', '9:30 AM',  NULL,                      '2026-09-06 09:45:00'),
(5171, 2025, 1013, 4041, 'COMPLETED', 180.00, 'UPI',  '10:00 AM', NULL,                      '2026-09-05 18:30:00'),
(5172, 2035, 1013, 4041, 'COMPLETED', 240.00, 'CASH', '10:30 AM', NULL,                      '2026-09-05 19:00:00'),
-- === DROP 4042 (Pastry Weekend — OPEN) ===
(5173, 2015, 1013, 4042, 'PLACED',    560.00, 'UPI',  '10:00 AM', NULL,                      '2026-09-13 18:30:00'),
(5174, 2035, 1013, 4042, 'PLACED',    340.00, 'CASH', '10:30 AM', NULL,                      '2026-09-13 19:00:00'),
-- === DROP 4043 (Onam Special — COMPLETED) ===
(5175, 2002, 1014, 4043, 'COMPLETED', 480.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-17 11:45:00'),
(5176, 2004, 1014, 4043, 'COMPLETED', 280.00, 'CASH', '12:00 PM', NULL,                      '2026-08-16 18:30:00'),
(5177, 2006, 1014, 4043, 'COMPLETED', 480.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-16 19:00:00'),
(5178, 2008, 1014, 4043, 'COMPLETED', 350.00, 'CARD', '12:00 PM', NULL,                      '2026-08-16 19:30:00'),
(5179, 2010, 1014, 4043, 'COMPLETED', 200.00, 'CASH', '12:30 PM', NULL,                      '2026-08-16 20:00:00'),
(5180, 2012, 1014, 4043, 'COMPLETED', 480.00, 'UPI',  '11:30 AM', NULL,                      '2026-08-16 20:30:00'),
(5181, 2014, 1014, 4043, 'COMPLETED', 350.00, 'CASH', '12:00 PM', NULL,                      '2026-08-16 21:00:00'),
(5182, 2016, 1014, 4043, 'COMPLETED', 480.00, 'UPI',  '12:30 PM', NULL,                      '2026-08-16 21:30:00'),
-- === DROP 4044 (Kerala Breakfast Box — COMPLETED) ===
(5183, 2002, 1014, 4044, 'COMPLETED', 430.00, 'UPI',  '8:30 AM',  NULL,                      '2026-08-31 08:45:00'),
(5184, 2004, 1014, 4044, 'COMPLETED', 150.00, 'CASH', '9:00 AM',  NULL,                      '2026-08-30 18:30:00'),
(5185, 2006, 1014, 4044, 'COMPLETED', 280.00, 'UPI',  '8:30 AM',  NULL,                      '2026-08-30 19:00:00'),
(5186, 2008, 1014, 4044, 'COMPLETED', 430.00, 'CARD', '9:00 AM',  NULL,                      '2026-08-30 19:30:00'),
(5187, 2010, 1014, 4044, 'COMPLETED', 150.00, 'CASH', '9:30 AM',  NULL,                      '2026-08-30 20:00:00'),
(5188, 2012, 1014, 4044, 'COMPLETED', 430.00, 'UPI',  '8:30 AM',  NULL,                      '2026-08-30 20:30:00'),
-- === DROP 4045 (Sadya & Kozhikodan Biryani — COMPLETED) ===
(5189, 2002, 1014, 4045, 'COMPLETED', 550.00, 'UPI',  '12:00 PM', NULL,                      '2026-09-07 12:15:00'),
(5190, 2004, 1014, 4045, 'COMPLETED', 250.00, 'CASH', '12:30 PM', NULL,                      '2026-09-06 18:30:00'),
(5191, 2006, 1014, 4045, 'COMPLETED', 300.00, 'UPI',  '1:00 PM',  NULL,                      '2026-09-06 19:00:00'),
(5192, 2008, 1014, 4045, 'COMPLETED', 550.00, 'CARD', '12:00 PM', NULL,                      '2026-09-06 19:30:00'),
(5193, 2014, 1014, 4045, 'COMPLETED', 300.00, 'CASH', '12:30 PM', NULL,                      '2026-09-06 20:00:00'),
-- === DROP 4046 (Prawn Curry & Karimeen — READY) ===
(5194, 2002, 1014, 4046, 'READY',     670.00, 'UPI',  '12:00 PM', NULL,                      '2026-09-09 18:30:00'),
(5195, 2004, 1014, 4046, 'READY',     320.00, 'CASH', '12:30 PM', NULL,                      '2026-09-09 19:00:00'),
(5196, 2006, 1014, 4046, 'PREPARING', 670.00, 'UPI',  '1:00 PM',  NULL,                      '2026-09-09 19:30:00'),
(5197, 2008, 1014, 4046, 'PREPARING', 350.00, 'CARD', '12:00 PM', NULL,                      '2026-09-09 20:00:00'),
(5198, 2010, 1014, 4046, 'PLACED',    320.00, 'CASH', '12:30 PM', NULL,                      '2026-09-09 20:30:00'),
(5199, 2012, 1014, 4046, 'PLACED',    670.00, 'UPI',  '1:00 PM',  NULL,                      '2026-09-09 21:00:00'),
-- === DROP 4047 (Appam & Parotta Weekend — OPEN) ===
(5200, 2002, 1014, 4047, 'PLACED',    420.00, 'UPI',  '12:00 PM', NULL,                      '2026-09-13 18:30:00'),
(5201, 2016, 1014, 4047, 'PLACED',    220.00, 'CASH', '12:30 PM', NULL,                      '2026-09-13 19:00:00'),
(5202, 2024, 1014, 4047, 'PLACED',    640.00, 'UPI',  '1:00 PM',  NULL,                      '2026-09-13 19:30:00'),
-- === DROP 4048 (Millet Tiffin — COMPLETED) ===
(5203, 2030, 1015, 4048, 'COMPLETED', 190.00, 'CASH', '9:30 AM',  NULL,                      '2026-09-07 09:45:00'),
(5204, 2040, 1015, 4048, 'COMPLETED', 110.00, 'UPI',  '10:00 AM', NULL,                      '2026-09-06 18:30:00'),
(5205, 2045, 1015, 4048, 'COMPLETED', 190.00, 'CASH', '9:30 AM',  NULL,                      '2026-09-06 19:00:00');

-- ============================================================
-- SECTION 10: ORDER ITEMS  [6001–6380]
-- (order_id, item_id, quantity, unit_price)
-- ============================================================
INSERT INTO order_items (order_item_id, order_id, item_id, quantity, unit_price) VALUES
-- Drop 4001 orders
(6001,5001,3001,2,280.00),(6002,5001,3005,1,140.00),
(6003,5002,3001,1,280.00),
(6004,5003,3001,1,280.00),(6005,5003,3005,2,140.00),
(6006,5004,3001,1,280.00),(6007,5004,3005,1,140.00),
(6008,5005,3001,1,280.00),
-- Drop 4002 orders
(6009,5007,3002,2,160.00),(6010,5007,3012,2,80.00),
(6011,5008,3002,1,160.00),(6012,5008,3012,1,80.00),(6013,5008,3001,1,75.00),
(6014,5009,3002,3,160.00),
(6015,5010,3002,1,150.00),
(6016,5011,3012,2,80.00),(6017,5011,3002,1,160.00),
(6018,5012,3002,1,150.00),
-- Drop 4003 orders
(6019,5013,3003,2,120.00),(6020,5013,3006,2,120.00),
(6021,5014,3006,3,120.00),
(6022,5015,3003,2,120.00),
(6023,5017,3008,3,120.00),
-- Drop 4004 orders (READY)
(6024,5018,3007,1,600.00),
(6025,5019,3004,1,150.00),(6026,5019,3007,1,600.00),
(6027,5020,3004,2,150.00),(6028,5020,3007,1,100.00),
(6029,5021,3007,1,400.00),(6030,5021,3004,1,150.00),
(6031,5022,3004,2,150.00),
(6032,5023,3007,1,600.00),(6033,5023,3004,1,200.00),
(6034,5024,3004,2,200.00),
(6035,5025,3007,1,300.00),
-- Drop 4005 orders (OPEN/PLACED)
(6036,5026,3009,1,280.00),(6037,5026,3001,1,220.00),
(6038,5027,3009,2,220.00),
(6039,5028,3001,1,220.00),
(6040,5029,3009,1,280.00),(6041,5029,3001,1,220.00),
(6042,5030,3001,1,280.00),
-- Drop 4007 orders (Dal Makhani)
(6043,5031,3013,1,180.00),(6044,5031,3014,1,100.00),
(6045,5032,3013,1,200.00),
(6046,5033,3014,2,100.00),(6047,5033,3013,1,40.00),
(6048,5034,3014,1,150.00),
(6049,5035,3013,1,180.00),(6050,5035,3014,1,100.00),
(6051,5036,3014,2,100.00),(6052,5036,3013,1,40.00),
-- Drop 4008 orders
(6053,5037,3015,1,130.00),(6054,5037,3018,1,130.00),
(6055,5038,3015,1,200.00),
(6056,5039,3018,1,130.00),
(6057,5040,3015,1,130.00),(6058,5040,3018,1,130.00),
(6059,5041,3015,1,200.00),
-- Drop 4009 orders (OPEN)
(6060,5042,3016,1,280.00),
(6061,5043,3020,1,220.00),(6062,5043,3022,1,200.00),
(6063,5044,3016,1,180.00),(6064,5044,3022,1,50.00),
-- Drop 4012 orders (Eid Biryani)
(6065,5045,3035,1,450.00),(6066,5045,3041,1,250.00),
(6067,5046,3036,1,350.00),(6068,5046,3043,2,130.00),
(6069,5047,3037,1,280.00),(6070,5047,3043,1,130.00),
(6071,5048,3035,1,350.00),
(6072,5049,3035,1,450.00),(6073,5049,3041,1,250.00),
(6074,5050,3037,1,280.00),(6075,5050,3043,1,130.00),
(6076,5051,3036,1,350.00),(6077,5051,3041,1,260.00),
-- Drop 4013 orders (Chicken Biryani Sunday)
(6078,5053,3036,1,350.00),(6079,5053,3038,1,280.00),(6080,5053,3039,1,80.00),
(6081,5054,3036,1,350.00),(6082,5054,3039,2,90.00),
(6083,5055,3036,1,280.00),
(6084,5056,3038,1,280.00),(6085,5056,3039,2,85.00),
(6086,5057,3036,1,350.00),(6087,5057,3038,1,280.00),(6088,5057,3039,1,80.00),
(6089,5058,3036,1,350.00),(6090,5058,3039,2,90.00),
(6091,5059,3036,1,280.00),
(6092,5060,3038,1,280.00),(6093,5060,3039,2,85.00),
(6094,5061,3036,1,280.00),
(6095,5062,3036,1,350.00),(6096,5062,3039,2,90.00),
-- Drop 4014 orders (Veg Biryani)
(6097,5063,3037,1,320.00),
(6098,5064,3037,1,320.00),
(6099,5065,3042,1,220.00),
(6100,5066,3042,1,220.00),
(6101,5067,3037,1,320.00),
-- Drop 4015 orders (OPEN)
(6102,5069,3035,1,450.00),(6103,5069,3043,1,180.00),
(6104,5070,3043,2,175.00),
(6105,5071,3035,1,450.00),(6106,5071,3043,1,180.00),
(6107,5072,3036,1,350.00),(6108,5072,3043,1,60.00),
(6109,5073,3036,1,280.00),
(6110,5074,3043,2,175.00),
-- Drop 4017 orders (Vada Pav)
(6111,5075,3047,2,60.00),(6112,5075,3048,1,60.00),
(6113,5076,3047,2,60.00),
(6114,5077,3047,1,60.00),
(6115,5078,3047,2,60.00),(6116,5078,3048,1,60.00),
-- Drop 4018 orders (OPEN)
(6117,5079,3047,2,60.00),(6118,5079,3049,1,110.00),
(6119,5080,3048,1,120.00),(6120,5080,3050,1,70.00),
(6121,5081,3047,1,60.00),(6122,5081,3050,2,45.00),
-- Drop 4019 orders (Keto Monday)
(6123,5082,3057,1,250.00),(6124,5082,3058,1,150.00),
(6125,5083,3057,1,250.00),(6126,5083,3058,1,150.00),
(6127,5084,3057,1,250.00),
(6128,5085,3057,1,250.00),(6129,5085,3058,1,150.00),
(6130,5086,3057,1,250.00),(6131,5086,3058,1,150.00),
-- Drop 4020 orders (Keto Breakfast)
(6132,5087,3059,2,200.00),
(6133,5088,3060,2,240.00),
(6134,5089,3059,1,200.00),
(6135,5090,3059,2,200.00),
-- Drop 4021 orders (OPEN)
(6136,5091,3061,1,280.00),(6137,5091,3064,1,170.00),
(6138,5092,3061,1,280.00),(6139,5092,3064,1,170.00),
-- Drop 4023 orders (Dosa & Idli)
(6140,5093,3069,1,120.00),(6141,5093,3070,1,100.00),
(6142,5094,3069,1,100.00),(6143,5094,3070,1,100.00),
(6144,5095,3070,1,120.00),
(6145,5096,3069,1,100.00),(6146,5096,3070,1,100.00),
(6147,5097,3069,1,120.00),(6148,5097,3070,1,100.00),
(6149,5098,3070,1,120.00),
-- Drop 4024 orders (Vada & Upma)
(6150,5099,3071,2,80.00),(6151,5099,3073,1,20.00),
(6152,5100,3073,2,50.00),
(6153,5101,3071,1,80.00),(6154,5101,3073,1,80.00),
(6155,5102,3071,2,80.00),(6156,5102,3073,1,20.00),
(6157,5103,3073,2,50.00),
-- Drop 4025 orders (OPEN)
(6158,5104,3075,1,150.00),(6159,5104,3072,1,100.00),
(6160,5105,3074,1,160.00),(6161,5105,3072,1,90.00),
-- Drop 4026 orders (Bengali Sweets)
(6162,5106,3081,2,120.00),(6163,5106,3082,1,180.00),
(6164,5107,3083,2,120.00),
(6165,5108,3081,1,100.00),
(6166,5109,3082,1,180.00),(6167,5109,3083,1,200.00),
(6168,5110,3081,2,120.00),
(6169,5111,3083,1,200.00),(6170,5111,3082,1,180.00),
(6171,5112,3082,2,180.00),(6172,5112,3081,1,60.00),
(6173,5113,3081,1,100.00),
-- Drop 4027 orders (Festival Sweets)
(6174,5114,3084,2,200.00),(6175,5114,3085,2,140.00),
(6176,5115,3084,1,200.00),(6177,5115,3085,2,140.00),
(6178,5116,3084,1,200.00),(6179,5116,3087,3,120.00),
(6180,5117,3085,2,175.00),
(6181,5118,3084,2,200.00),(6182,5118,3085,2,140.00),
(6183,5119,3084,1,200.00),(6184,5119,3085,2,140.00),
(6185,5120,3085,2,140.00),(6186,5120,3087,2,100.00),
(6187,5121,3085,2,175.00),
(6188,5122,3084,1,200.00),(6189,5122,3087,3,120.00),
(6190,5123,3085,2,175.00),
-- Drop 4028 orders (Autumn Misti)
(6191,5124,3086,2,170.00),(6192,5124,3088,1,150.00),
(6193,5125,3088,2,170.00),
(6194,5126,3086,2,170.00),(6195,5126,3088,1,150.00),
(6196,5127,3088,2,170.00),
(6197,5128,3086,2,170.00),(6198,5128,3088,1,150.00),
(6199,5129,3088,2,170.00),
-- Drop 4029 orders (READY)
(6200,5131,3091,2,200.00),
(6201,5132,3092,3,120.00),
(6202,5133,3091,2,200.00),
(6203,5134,3092,3,120.00),
(6204,5135,3091,2,200.00),
(6205,5136,3091,2,200.00),
(6206,5137,3092,3,120.00),
(6207,5138,3091,2,200.00),
-- Drop 4031 orders (Detox Monday)
(6208,5139,3093,1,250.00),(6209,5139,3094,1,280.00),
(6210,5140,3093,1,250.00),(6211,5140,3094,1,280.00),
(6212,5141,3093,1,250.00),
(6213,5142,3094,1,280.00),
(6214,5143,3093,1,250.00),(6215,5143,3094,1,280.00),
-- Drop 4032 orders (OPEN)
(6216,5144,3095,1,320.00),(6217,5144,3097,1,250.00),
(6218,5145,3097,1,320.00),
-- Drop 4033 orders (Carbonara)
(6219,5146,3105,1,350.00),(6220,5146,3109,2,75.00),
(6221,5147,3105,1,350.00),(6222,5147,3109,2,75.00),
(6223,5148,3109,2,75.00),(6224,5148,3105,1,200.00),
(6225,5149,3109,2,75.00),(6226,5149,3105,1,200.00),
(6227,5150,3105,1,350.00),(6228,5150,3109,2,75.00),
-- Drop 4034 orders
(6229,5151,3106,1,250.00),(6230,5151,3111,2,65.00),
(6231,5152,3111,2,65.00),(6232,5152,3106,1,150.00),
(6233,5153,3106,1,250.00),(6234,5153,3111,2,65.00),
(6235,5154,3111,2,65.00),(6236,5154,3106,1,150.00),
-- Drop 4035 orders (OPEN)
(6237,5155,3107,1,350.00),(6238,5155,3110,2,85.00),
(6239,5156,3107,1,350.00),(6240,5156,3110,2,85.00),
-- Drop 4036 orders (Thali)
(6241,5157,3117,1,290.00),
(6242,5158,3118,2,100.00),
(6243,5159,3118,2,100.00),
(6244,5160,3117,1,290.00),
-- Drop 4038 orders (Momos)
(6245,5161,3129,2,120.00),(6246,5161,3131,1,60.00),
(6247,5162,3129,2,120.00),(6248,5162,3131,1,60.00),
(6249,5163,3131,1,60.00),(6250,5163,3129,1,120.00),
-- Drop 4039 orders (OPEN)
(6251,5164,3130,2,130.00),(6252,5164,3137,1,30.00),
(6253,5165,3137,2,120.00),(6254,5165,3130,1,30.00),
-- Drop 4040 orders (Goan Sweets)
(6255,5166,3139,1,250.00),(6256,5166,3140,1,100.00),
(6257,5167,3139,1,250.00),(6258,5167,3140,1,50.00),
(6259,5168,3140,1,200.00),
(6260,5169,3139,1,250.00),(6261,5169,3140,1,100.00),
-- Drop 4041 orders
(6262,5170,3142,2,80.00),(6263,5170,3145,1,80.00),
(6264,5171,3142,1,80.00),(6265,5171,3145,1,100.00),
(6266,5172,3142,2,80.00),(6267,5172,3145,1,80.00),
-- Drop 4042 orders (OPEN)
(6268,5173,3141,2,180.00),(6269,5173,3148,2,100.00),
(6270,5174,3141,1,180.00),(6271,5174,3150,2,80.00),
-- Drop 4043 orders (Onam)
(6272,5175,3151,2,180.00),(6273,5175,3152,1,120.00),
(6274,5176,3152,1,280.00),
(6275,5177,3151,2,180.00),(6276,5177,3152,1,120.00),
(6277,5178,3151,1,180.00),(6278,5178,3152,1,170.00),
(6279,5179,3151,1,200.00),
(6280,5180,3151,2,180.00),(6281,5180,3152,1,120.00),
(6282,5181,3151,1,180.00),(6283,5181,3152,1,170.00),
(6284,5182,3151,2,180.00),(6285,5182,3152,1,120.00),
-- Drop 4044 orders (Kerala Breakfast)
(6286,5183,3154,2,200.00),(6287,5183,3156,1,30.00),
(6288,5184,3154,1,150.00),
(6289,5185,3156,1,120.00),(6290,5185,3154,1,160.00),
(6291,5186,3154,2,200.00),(6292,5186,3156,1,30.00),
(6293,5187,3154,1,150.00),
(6294,5188,3154,2,200.00),(6295,5188,3156,1,30.00),
-- Drop 4045 orders
(6296,5189,3157,1,250.00),(6297,5189,3158,1,300.00),
(6298,5190,3157,1,250.00),
(6299,5191,3158,1,300.00),
(6300,5192,3157,1,250.00),(6301,5192,3158,1,300.00),
(6302,5193,3158,1,300.00),
-- Drop 4046 orders (READY)
(6303,5194,3153,1,350.00),(6304,5194,3159,1,320.00),
(6305,5195,3153,1,320.00),
(6306,5196,3153,1,350.00),(6307,5196,3159,1,320.00),
(6308,5197,3159,1,350.00),
(6309,5198,3153,1,320.00),
(6310,5199,3153,1,350.00),(6311,5199,3159,1,320.00),
-- Drop 4047 orders (OPEN)
(6312,5200,3151,2,180.00),(6313,5200,3155,1,60.00),
(6314,5201,3161,1,220.00),
(6315,5202,3151,2,180.00),(6316,5202,3155,1,280.00),
-- Drop 4048 orders (Millet)
(6317,5203,3163,1,120.00),(6318,5203,3164,1,70.00),
(6319,5204,3164,1,110.00),
(6320,5205,3163,1,120.00),(6321,5205,3164,1,70.00);

-- ============================================================
-- SECTION 11: PAYMENTS
-- (order_id, status, method, amount, transaction_id, collected_at)
-- ============================================================
INSERT INTO payments (payment_id, order_id, status, method, amount, transaction_id, collected_at) VALUES
-- === COMPLETED orders — all collected ===
-- Drop 4001
(7001,5001,'COLLECTED','UPI',   700.00, 'TXN-4001-5001', '2026-08-11 10:20:00'),
(7002,5002,'COLLECTED','CASH',  280.00, 'TXN-4001-5002', '2026-08-11 10:35:00'),
(7003,5003,'COLLECTED','UPI',   540.00, 'TXN-4001-5003', '2026-08-11 11:05:00'),
(7004,5004,'COLLECTED','UPI',   360.00, 'TXN-4001-5004', '2026-08-11 10:20:00'),
(7005,5005,'COLLECTED','CARD',  280.00, 'TXN-4001-5005', '2026-08-11 11:35:00'),
(7006,5006,'REFUNDED', 'UPI',   560.00, 'TXN-4001-5006', NULL),
-- Drop 4002
(7007,5007,'COLLECTED','UPI',   480.00, 'TXN-4002-5007', '2026-08-18 09:50:00'),
(7008,5008,'COLLECTED','CASH',  315.00, 'TXN-4002-5008', '2026-08-18 10:05:00'),
(7009,5009,'COLLECTED','UPI',   480.00, 'TXN-4002-5009', '2026-08-18 10:35:00'),
(7010,5010,'COLLECTED','CASH',  150.00, 'TXN-4002-5010', '2026-08-18 09:05:00'),
(7011,5011,'COLLECTED','UPI',   315.00, 'TXN-4002-5011', '2026-08-18 09:35:00'),
(7012,5012,'COLLECTED','CARD',  150.00, 'TXN-4002-5012', '2026-08-18 10:05:00'),
-- Drop 4003
(7013,5013,'COLLECTED','UPI',   480.00, 'TXN-4003-5013', '2026-08-25 10:20:00'),
(7014,5014,'COLLECTED','CASH',  360.00, 'TXN-4003-5014', '2026-08-25 11:05:00'),
(7015,5015,'COLLECTED','UPI',   240.00, 'TXN-4003-5015', '2026-08-25 10:35:00'),
(7016,5016,'REFUNDED', 'UPI',   180.00, 'TXN-4003-5016', NULL),
(7017,5017,'COLLECTED','CARD',  360.00, 'TXN-4003-5017', '2026-08-25 11:35:00'),
-- Drop 4004 READY — pending/not collected yet
(7018,5018,'PENDING',  'UPI',   600.00, NULL, NULL),
(7019,5019,'PENDING',  'CASH',  700.00, NULL, NULL),
(7020,5020,'PENDING',  'UPI',   400.00, NULL, NULL),
(7021,5021,'PENDING',  'CARD',  550.00, NULL, NULL),
(7022,5022,'PENDING',  'UPI',   300.00, NULL, NULL),
(7023,5023,'PENDING',  'CARD',  800.00, NULL, NULL),
(7024,5024,'PENDING',  'UPI',   400.00, NULL, NULL),
(7025,5025,'PENDING',  'CASH',  300.00, NULL, NULL),
-- Drop 4005 OPEN — pending
(7026,5026,'PENDING',  'UPI',   500.00, NULL, NULL),
(7027,5027,'PENDING',  'CASH',  440.00, NULL, NULL),
(7028,5028,'PENDING',  'UPI',   220.00, NULL, NULL),
(7029,5029,'PENDING',  'CARD',  500.00, NULL, NULL),
(7030,5030,'PENDING',  'UPI',   280.00, NULL, NULL),
-- Drop 4007
(7031,5031,'COLLECTED','UPI',   280.00, 'TXN-4007-5031', '2026-08-18 12:35:00'),
(7032,5032,'COLLECTED','CASH',  200.00, 'TXN-4007-5032', '2026-08-18 12:35:00'),
(7033,5033,'COLLECTED','UPI',   240.00, 'TXN-4007-5033', '2026-08-18 13:05:00'),
(7034,5034,'COLLECTED','CASH',  150.00, 'TXN-4007-5034', '2026-08-18 12:05:00'),
(7035,5035,'COLLECTED','UPI',   280.00, 'TXN-4007-5035', '2026-08-18 12:35:00'),
(7036,5036,'COLLECTED','CARD',  240.00, 'TXN-4007-5036', '2026-08-18 13:05:00'),
-- Drop 4008
(7037,5037,'COLLECTED','UPI',   260.00, 'TXN-4008-5037', '2026-08-25 12:35:00'),
(7038,5038,'COLLECTED','CASH',  200.00, 'TXN-4008-5038', '2026-08-25 12:35:00'),
(7039,5039,'COLLECTED','UPI',   130.00, 'TXN-4008-5039', '2026-08-25 13:05:00'),
(7040,5040,'COLLECTED','UPI',   260.00, 'TXN-4008-5040', '2026-08-25 12:05:00'),
(7041,5041,'COLLECTED','CASH',  200.00, 'TXN-4008-5041', '2026-08-25 12:35:00'),
-- Drop 4009 OPEN
(7042,5042,'PENDING',  'UPI',   280.00, NULL, NULL),
(7043,5043,'PENDING',  'CASH',  420.00, NULL, NULL),
(7044,5044,'PENDING',  'UPI',   230.00, NULL, NULL),
-- Drop 4012 Eid Biryani
(7045,5045,'COLLECTED','UPI',   700.00, 'TXN-4012-5045', '2026-07-06 13:35:00'),
(7046,5046,'COLLECTED','CASH',  610.00, 'TXN-4012-5046', '2026-07-06 13:35:00'),
(7047,5047,'COLLECTED','UPI',   410.00, 'TXN-4012-5047', '2026-07-06 14:05:00'),
(7048,5048,'COLLECTED','CARD',  350.00, 'TXN-4012-5048', '2026-07-06 13:05:00'),
(7049,5049,'COLLECTED','UPI',   700.00, 'TXN-4012-5049', '2026-07-06 13:35:00'),
(7050,5050,'COLLECTED','CASH',  410.00, 'TXN-4012-5050', '2026-07-06 14:05:00'),
(7051,5051,'COLLECTED','UPI',   610.00, 'TXN-4012-5051', '2026-07-06 13:05:00'),
(7052,5052,'REFUNDED', 'UPI',   350.00, 'TXN-4012-5052', NULL),
-- Drop 4013 Chicken Biryani
(7053,5053,'COLLECTED','UPI',   710.00, 'TXN-4013-5053', '2026-07-20 13:35:00'),
(7054,5054,'COLLECTED','CASH',  530.00, 'TXN-4013-5054', '2026-07-20 13:35:00'),
(7055,5055,'COLLECTED','UPI',   280.00, 'TXN-4013-5055', '2026-07-20 14:05:00'),
(7056,5056,'COLLECTED','CARD',  450.00, 'TXN-4013-5056', '2026-07-20 13:05:00'),
(7057,5057,'COLLECTED','UPI',   710.00, 'TXN-4013-5057', '2026-07-20 13:35:00'),
(7058,5058,'COLLECTED','CASH',  530.00, 'TXN-4013-5058', '2026-07-20 14:05:00'),
(7059,5059,'COLLECTED','UPI',   280.00, 'TXN-4013-5059', '2026-07-20 13:05:00'),
(7060,5060,'COLLECTED','CARD',  450.00, 'TXN-4013-5060', '2026-07-20 13:35:00'),
(7061,5061,'COLLECTED','UPI',   280.00, 'TXN-4013-5061', '2026-07-20 14:05:00'),
(7062,5062,'COLLECTED','CASH',  530.00, 'TXN-4013-5062', '2026-07-20 13:05:00'),
-- Drop 4014 Veg Biryani
(7063,5063,'COLLECTED','UPI',   320.00, 'TXN-4014-5063', '2026-08-03 13:35:00'),
(7064,5064,'COLLECTED','UPI',   320.00, 'TXN-4014-5064', '2026-08-03 13:35:00'),
(7065,5065,'COLLECTED','CASH',  220.00, 'TXN-4014-5065', '2026-08-03 14:05:00'),
(7066,5066,'COLLECTED','CASH',  220.00, 'TXN-4014-5066', '2026-08-03 13:05:00'),
(7067,5067,'COLLECTED','UPI',   320.00, 'TXN-4014-5067', '2026-08-03 13:35:00'),
(7068,5068,'REFUNDED', 'UPI',   220.00, 'TXN-4014-5068', NULL),
-- Drop 4015 OPEN
(7069,5069,'PENDING',  'UPI',   630.00, NULL, NULL),
(7070,5070,'PENDING',  'CASH',  350.00, NULL, NULL),
(7071,5071,'PENDING',  'UPI',   630.00, NULL, NULL),
(7072,5072,'PENDING',  'CARD',  410.00, NULL, NULL),
(7073,5073,'PENDING',  'UPI',   280.00, NULL, NULL),
(7074,5074,'PENDING',  'CASH',  350.00, NULL, NULL),
-- Drop 4017 Vada Pav
(7075,5075,'COLLECTED','CASH',  180.00, 'TXN-4017-5075', '2026-08-28 17:50:00'),
(7076,5076,'COLLECTED','UPI',   120.00, 'TXN-4017-5076', '2026-08-28 18:05:00'),
(7077,5077,'COLLECTED','CASH',  60.00,  'TXN-4017-5077', '2026-08-28 19:05:00'),
(7078,5078,'COLLECTED','UPI',   180.00, 'TXN-4017-5078', '2026-08-28 18:35:00'),
-- Drop 4018 OPEN
(7079,5079,'PENDING',  'CASH',  230.00, NULL, NULL),
(7080,5080,'PENDING',  'UPI',   190.00, NULL, NULL),
(7081,5081,'PENDING',  'CASH',  150.00, NULL, NULL),
-- Drop 4019 Keto Monday
(7082,5082,'COLLECTED','UPI',   400.00, 'TXN-4019-5082', '2026-08-25 08:50:00'),
(7083,5083,'COLLECTED','UPI',   400.00, 'TXN-4019-5083', '2026-08-25 09:05:00'),
(7084,5084,'COLLECTED','CASH',  250.00, 'TXN-4019-5084', '2026-08-25 08:35:00'),
(7085,5085,'COLLECTED','CARD',  400.00, 'TXN-4019-5085', '2026-08-25 09:05:00'),
(7086,5086,'COLLECTED','UPI',   400.00, 'TXN-4019-5086', '2026-08-25 09:35:00'),
-- Drop 4020 Keto Breakfast
(7087,5087,'COLLECTED','UPI',   400.00, 'TXN-4020-5087', '2026-09-01 08:50:00'),
(7088,5088,'COLLECTED','CASH',  480.00, 'TXN-4020-5088', '2026-09-01 09:05:00'),
(7089,5089,'COLLECTED','UPI',   200.00, 'TXN-4020-5089', '2026-09-01 08:35:00'),
(7090,5090,'COLLECTED','CARD',  400.00, 'TXN-4020-5090', '2026-09-01 09:35:00'),
-- Drop 4021 OPEN
(7091,5091,'PENDING',  'UPI',   450.00, NULL, NULL),
(7092,5092,'PENDING',  'CASH',  450.00, NULL, NULL),
-- Drop 4023 Dosa & Idli
(7093,5093,'COLLECTED','CASH',  220.00, 'TXN-4023-5093', '2026-08-24 08:50:00'),
(7094,5094,'COLLECTED','UPI',   200.00, 'TXN-4023-5094', '2026-08-24 09:05:00'),
(7095,5095,'COLLECTED','CASH',  120.00, 'TXN-4023-5095', '2026-08-24 08:35:00'),
(7096,5096,'COLLECTED','UPI',   200.00, 'TXN-4023-5096', '2026-08-24 09:05:00'),
(7097,5097,'COLLECTED','CARD',  220.00, 'TXN-4023-5097', '2026-08-24 09:35:00'),
(7098,5098,'COLLECTED','CASH',  120.00, 'TXN-4023-5098', '2026-08-24 08:35:00'),
-- Drop 4024 Vada & Upma
(7099,5099,'COLLECTED','UPI',   180.00, 'TXN-4024-5099', '2026-09-01 08:50:00'),
(7100,5100,'COLLECTED','CASH',  100.00, 'TXN-4024-5100', '2026-09-01 09:05:00'),
(7101,5101,'COLLECTED','UPI',   160.00, 'TXN-4024-5101', '2026-09-01 08:35:00'),
(7102,5102,'COLLECTED','CARD',  180.00, 'TXN-4024-5102', '2026-09-01 09:35:00'),
(7103,5103,'COLLECTED','CASH',  100.00, 'TXN-4024-5103', '2026-09-01 09:05:00'),
-- Drop 4025 OPEN
(7104,5104,'PENDING',  'CASH',  250.00, NULL, NULL),
(7105,5105,'PENDING',  'UPI',   250.00, NULL, NULL),
-- Drop 4026 Bengali Sweets
(7106,5106,'COLLECTED','UPI',   420.00, 'TXN-4026-5106', '2026-08-10 11:50:00'),
(7107,5107,'COLLECTED','CASH',  240.00, 'TXN-4026-5107', '2026-08-10 12:05:00'),
(7108,5108,'COLLECTED','UPI',   100.00, 'TXN-4026-5108', '2026-08-10 11:35:00'),
(7109,5109,'COLLECTED','CASH',  380.00, 'TXN-4026-5109', '2026-08-10 12:05:00'),
(7110,5110,'COLLECTED','CARD',  240.00, 'TXN-4026-5110', '2026-08-10 12:35:00'),
(7111,5111,'COLLECTED','UPI',   380.00, 'TXN-4026-5111', '2026-08-10 11:35:00'),
(7112,5112,'COLLECTED','CASH',  420.00, 'TXN-4026-5112', '2026-08-10 12:05:00'),
(7113,5113,'COLLECTED','UPI',   100.00, 'TXN-4026-5113', '2026-08-10 12:35:00'),
-- Drop 4027 Festival Sweets
(7114,5114,'COLLECTED','UPI',   680.00, 'TXN-4027-5114', '2026-08-24 11:50:00'),
(7115,5115,'COLLECTED','CASH',  480.00, 'TXN-4027-5115', '2026-08-24 12:05:00'),
(7116,5116,'COLLECTED','UPI',   550.00, 'TXN-4027-5116', '2026-08-24 11:35:00'),
(7117,5117,'COLLECTED','CASH',  350.00, 'TXN-4027-5117', '2026-08-24 12:05:00'),
(7118,5118,'COLLECTED','CARD',  680.00, 'TXN-4027-5118', '2026-08-24 12:35:00'),
(7119,5119,'COLLECTED','UPI',   480.00, 'TXN-4027-5119', '2026-08-24 11:35:00'),
(7120,5120,'COLLECTED','CASH',  480.00, 'TXN-4027-5120', '2026-08-24 12:05:00'),
(7121,5121,'COLLECTED','UPI',   350.00, 'TXN-4027-5121', '2026-08-24 12:35:00'),
(7122,5122,'COLLECTED','CASH',  550.00, 'TXN-4027-5122', '2026-08-24 11:35:00'),
(7123,5123,'COLLECTED','UPI',   350.00, 'TXN-4027-5123', '2026-08-24 12:05:00'),
-- Drop 4028 Autumn Misti
(7124,5124,'COLLECTED','UPI',   490.00, 'TXN-4028-5124', '2026-09-01 11:50:00'),
(7125,5125,'COLLECTED','CASH',  340.00, 'TXN-4028-5125', '2026-09-01 12:05:00'),
(7126,5126,'COLLECTED','UPI',   490.00, 'TXN-4028-5126', '2026-09-01 11:35:00'),
(7127,5127,'COLLECTED','CASH',  340.00, 'TXN-4028-5127', '2026-09-01 12:05:00'),
(7128,5128,'COLLECTED','CARD',  490.00, 'TXN-4028-5128', '2026-09-01 12:35:00'),
(7129,5129,'COLLECTED','UPI',   340.00, 'TXN-4028-5129', '2026-09-01 11:35:00'),
(7130,5130,'REFUNDED', 'UPI',   490.00, 'TXN-4028-5130', NULL),
-- Drop 4029 READY
(7131,5131,'PENDING',  'UPI',   400.00, NULL, NULL),
(7132,5132,'PENDING',  'CASH',  360.00, NULL, NULL),
(7133,5133,'PENDING',  'UPI',   400.00, NULL, NULL),
(7134,5134,'PENDING',  'CASH',  360.00, NULL, NULL),
(7135,5135,'PENDING',  'CARD',  400.00, NULL, NULL),
(7136,5136,'PENDING',  'UPI',   400.00, NULL, NULL),
(7137,5137,'PENDING',  'CASH',  360.00, NULL, NULL),
(7138,5138,'PENDING',  'UPI',   400.00, NULL, NULL),
-- Drop 4031 Detox Monday
(7139,5139,'COLLECTED','UPI',   530.00, 'TXN-4031-5139', '2026-09-01 12:20:00'),
(7140,5140,'COLLECTED','UPI',   530.00, 'TXN-4031-5140', '2026-09-01 12:35:00'),
(7141,5141,'COLLECTED','CASH',  250.00, 'TXN-4031-5141', '2026-09-01 13:05:00'),
(7142,5142,'COLLECTED','UPI',   280.00, 'TXN-4031-5142', '2026-09-01 12:05:00'),
(7143,5143,'COLLECTED','CARD',  530.00, 'TXN-4031-5143', '2026-09-01 12:35:00'),
-- Drop 4032 OPEN
(7144,5144,'PENDING',  'UPI',   570.00, NULL, NULL),
(7145,5145,'PENDING',  'CASH',  320.00, NULL, NULL),
-- Drop 4033 Carbonara
(7146,5146,'COLLECTED','UPI',   500.00, 'TXN-4033-5146', '2026-08-27 19:50:00'),
(7147,5147,'COLLECTED','UPI',   500.00, 'TXN-4033-5147', '2026-08-27 20:05:00'),
(7148,5148,'COLLECTED','CASH',  350.00, 'TXN-4033-5148', '2026-08-27 19:35:00'),
(7149,5149,'COLLECTED','CARD',  350.00, 'TXN-4033-5149', '2026-08-27 20:05:00'),
(7150,5150,'COLLECTED','UPI',   500.00, 'TXN-4033-5150', '2026-08-27 20:35:00'),
-- Drop 4034
(7151,5151,'COLLECTED','UPI',   380.00, 'TXN-4034-5151', '2026-09-03 19:50:00'),
(7152,5152,'COLLECTED','CASH',  280.00, 'TXN-4034-5152', '2026-09-03 20:05:00'),
(7153,5153,'COLLECTED','UPI',   380.00, 'TXN-4034-5153', '2026-09-03 19:35:00'),
(7154,5154,'COLLECTED','CARD',  280.00, 'TXN-4034-5154', '2026-09-03 20:35:00'),
-- Drop 4035 OPEN
(7155,5155,'PENDING',  'UPI',   520.00, NULL, NULL),
(7156,5156,'PENDING',  'CASH',  520.00, NULL, NULL),
-- Drop 4036 Thali
(7157,5157,'COLLECTED','CASH',  290.00, 'TXN-4036-5157', '2026-09-01 12:20:00'),
(7158,5158,'COLLECTED','UPI',   200.00, 'TXN-4036-5158', '2026-09-01 12:35:00'),
(7159,5159,'COLLECTED','CASH',  200.00, 'TXN-4036-5159', '2026-09-01 13:05:00'),
(7160,5160,'COLLECTED','UPI',   290.00, 'TXN-4036-5160', '2026-09-01 12:05:00'),
-- Drop 4038 Momos
(7161,5161,'COLLECTED','UPI',   300.00, 'TXN-4038-5161', '2026-09-07 18:50:00'),
(7162,5162,'COLLECTED','CASH',  300.00, 'TXN-4038-5162', '2026-09-07 19:05:00'),
(7163,5163,'COLLECTED','UPI',   180.00, 'TXN-4038-5163', '2026-09-07 18:35:00'),
-- Drop 4039 OPEN
(7164,5164,'PENDING',  'UPI',   290.00, NULL, NULL),
(7165,5165,'PENDING',  'CASH',  270.00, NULL, NULL),
-- Drop 4040 Goan Sweets
(7166,5166,'COLLECTED','UPI',   350.00, 'TXN-4040-5166', '2026-08-31 10:50:00'),
(7167,5167,'COLLECTED','CASH',  300.00, 'TXN-4040-5167', '2026-08-31 11:05:00'),
(7168,5168,'COLLECTED','UPI',   200.00, 'TXN-4040-5168', '2026-08-31 10:35:00'),
(7169,5169,'COLLECTED','CARD',  350.00, 'TXN-4040-5169', '2026-08-31 11:05:00'),
-- Drop 4041
(7170,5170,'COLLECTED','CASH',  240.00, 'TXN-4041-5170', '2026-09-06 09:50:00'),
(7171,5171,'COLLECTED','UPI',   180.00, 'TXN-4041-5171', '2026-09-06 10:05:00'),
(7172,5172,'COLLECTED','CASH',  240.00, 'TXN-4041-5172', '2026-09-06 10:35:00'),
-- Drop 4042 OPEN
(7173,5173,'PENDING',  'UPI',   560.00, NULL, NULL),
(7174,5174,'PENDING',  'CASH',  340.00, NULL, NULL),
-- Drop 4043 Onam
(7175,5175,'COLLECTED','UPI',   480.00, 'TXN-4043-5175', '2026-08-17 11:50:00'),
(7176,5176,'COLLECTED','CASH',  280.00, 'TXN-4043-5176', '2026-08-17 12:05:00'),
(7177,5177,'COLLECTED','UPI',   480.00, 'TXN-4043-5177', '2026-08-17 11:35:00'),
(7178,5178,'COLLECTED','CARD',  350.00, 'TXN-4043-5178', '2026-08-17 12:05:00'),
(7179,5179,'COLLECTED','CASH',  200.00, 'TXN-4043-5179', '2026-08-17 12:35:00'),
(7180,5180,'COLLECTED','UPI',   480.00, 'TXN-4043-5180', '2026-08-17 11:35:00'),
(7181,5181,'COLLECTED','CASH',  350.00, 'TXN-4043-5181', '2026-08-17 12:05:00'),
(7182,5182,'COLLECTED','UPI',   480.00, 'TXN-4043-5182', '2026-08-17 12:35:00'),
-- Drop 4044 Kerala Breakfast
(7183,5183,'COLLECTED','UPI',   430.00, 'TXN-4044-5183', '2026-08-31 08:50:00'),
(7184,5184,'COLLECTED','CASH',  150.00, 'TXN-4044-5184', '2026-08-31 09:05:00'),
(7185,5185,'COLLECTED','UPI',   280.00, 'TXN-4044-5185', '2026-08-31 08:35:00'),
(7186,5186,'COLLECTED','CARD',  430.00, 'TXN-4044-5186', '2026-08-31 09:05:00'),
(7187,5187,'COLLECTED','CASH',  150.00, 'TXN-4044-5187', '2026-08-31 09:35:00'),
(7188,5188,'COLLECTED','UPI',   430.00, 'TXN-4044-5188', '2026-08-31 08:35:00'),
-- Drop 4045
(7189,5189,'COLLECTED','UPI',   550.00, 'TXN-4045-5189', '2026-09-07 12:20:00'),
(7190,5190,'COLLECTED','CASH',  250.00, 'TXN-4045-5190', '2026-09-07 12:35:00'),
(7191,5191,'COLLECTED','UPI',   300.00, 'TXN-4045-5191', '2026-09-07 13:05:00'),
(7192,5192,'COLLECTED','CARD',  550.00, 'TXN-4045-5192', '2026-09-07 12:05:00'),
(7193,5193,'COLLECTED','CASH',  300.00, 'TXN-4045-5193', '2026-09-07 12:35:00'),
-- Drop 4046 READY
(7194,5194,'PENDING',  'UPI',   670.00, NULL, NULL),
(7195,5195,'PENDING',  'CASH',  320.00, NULL, NULL),
(7196,5196,'PENDING',  'UPI',   670.00, NULL, NULL),
(7197,5197,'PENDING',  'CARD',  350.00, NULL, NULL),
(7198,5198,'PENDING',  'CASH',  320.00, NULL, NULL),
(7199,5199,'PENDING',  'UPI',   670.00, NULL, NULL),
-- Drop 4047 OPEN
(7200,5200,'PENDING',  'UPI',   420.00, NULL, NULL),
(7201,5201,'PENDING',  'CASH',  220.00, NULL, NULL),
(7202,5202,'PENDING',  'UPI',   640.00, NULL, NULL),
-- Drop 4048 Millet
(7203,5203,'COLLECTED','CASH',  190.00, 'TXN-4048-5203', '2026-09-07 09:50:00'),
(7204,5204,'COLLECTED','UPI',   110.00, 'TXN-4048-5204', '2026-09-07 10:05:00'),
(7205,5205,'COLLECTED','CASH',  190.00, 'TXN-4048-5205', '2026-09-07 09:35:00');

-- ============================================================
-- SECTION 12: RATINGS
-- One rating per (user_id, restaurant_id) — UNIQUE constraint.
-- Only customers who completed at least one order rate a creator.
-- rating_value: 1.0–5.0
-- ============================================================
INSERT INTO ratings (rating_id, user_id, restaurant_id, rating_value, food_quality_rating, packaging_rating, review_text, created_at) VALUES
-- === Restaurant 1001 — The Artisan Oven (Priya Sharma) ===
(8001, 2001, 1001, 4.8, 5.0, 4.5, 'Priya bakes like a professional patisserie. Her sourdough is the best I have had outside of Europe!', '2026-08-11 12:00:00'),
(8002, 2002, 1001, 4.7, 4.8, 4.5, 'The pastries are incredibly fresh. I could taste the effort in every bite.', '2026-08-18 11:00:00'),
(8003, 2003, 1001, 5.0, 5.0, 5.0, 'Absolutely stunning bakes. The croissants melted in my mouth. 10/10.', '2026-08-11 11:30:00'),
(8004, 2004, 1001, 4.5, 4.5, 4.0, 'Good quality, a bit pricey but worth it for a special occasion.', '2026-08-18 12:00:00'),
(8005, 2005, 1001, 4.9, 5.0, 5.0, 'The banana bread is phenomenal. Will keep ordering every drop!', '2026-08-25 11:00:00'),
(8006, 2007, 1001, 4.6, 4.7, 4.3, 'Great packaging — everything arrived in perfect shape. Loved the pastries.', '2026-08-18 10:30:00'),
(8007, 2008, 1001, 4.8, 5.0, 4.5, 'Consistent quality every drop. One of my favourite home bakers on the platform.', '2026-08-25 12:00:00'),
(8008, 2013, 1001, 4.7, 4.8, 4.6, 'The muffins were so moist — none of that dry store-bought texture.', '2026-08-25 11:30:00'),
(8009, 2014, 1001, 4.5, 4.5, 4.0, 'Good variety in each drop. Appreciate the effort to keep things interesting.', '2026-08-25 12:30:00'),
(8010, 2017, 1001, 4.6, 4.7, 4.4, 'Beautiful presentation and amazing flavours. Totally worth the price.', '2026-08-25 13:00:00'),

-- === Restaurant 1002 — Maa Ki Rasoi (Kavitha Nair) ===
(8011, 2015, 1002, 4.9, 5.0, 4.8, 'Dal Makhani tastes exactly like my grandmother used to make. Tears of joy, honestly.', '2026-08-18 14:00:00'),
(8012, 2016, 1002, 4.7, 4.8, 4.5, 'Authentic home-style cooking. The khichdi was so comforting.', '2026-08-18 13:30:00'),
(8013, 2017, 1002, 4.8, 4.9, 4.6, 'Best home food I have had in this city. Always fresh, always warm.', '2026-08-18 14:30:00'),
(8014, 2018, 1002, 4.6, 4.7, 4.3, 'Good portions, real home-style taste. Dal was perfectly spiced.', '2026-08-18 12:30:00'),
(8015, 2019, 1002, 5.0, 5.0, 5.0, 'I order from Kavitha every single drop. She never disappoints. Absolutely love her cooking.', '2026-08-18 13:00:00'),
(8016, 2020, 1002, 4.8, 5.0, 4.5, 'The paneer in the chole was so well-cooked. Restaurant-quality at home-style prices.', '2026-08-25 14:00:00'),
(8017, 2021, 1002, 4.7, 4.8, 4.4, 'Honest, pure home cooking. No compromises on quality.', '2026-08-25 13:00:00'),
(8018, 2022, 1002, 4.5, 4.6, 4.2, 'Really enjoyed the khichdi. Simple but perfect comfort food.', '2026-08-25 13:30:00'),
(8019, 2023, 1002, 4.6, 4.7, 4.3, 'Reliable quality every time. The food always smells and tastes fresh.', '2026-08-25 14:30:00'),

-- === Restaurant 1004 — Hyderabadi Dum House (Zubeida Begum) ===
(8020, 2001, 1004, 4.9, 5.0, 4.7, 'The dum biryani was absolutely spectacular. Saffron aroma, perfectly cooked rice, tender meat. Nothing beats it.', '2026-07-20 15:00:00'),
(8021, 2002, 1004, 5.0, 5.0, 5.0, 'Best biryani in Hyderabad, hands down. Restaurant-quality from a home kitchen. Zubeida is a legend.', '2026-07-06 15:00:00'),
(8022, 2003, 1004, 4.7, 4.8, 4.5, 'Authentic Hyderabadi flavours. The raita perfectly balanced the spice.', '2026-07-20 15:30:00'),
(8023, 2004, 1004, 4.8, 5.0, 4.6, 'The mirchi ka salan was incredible. I ate three bowls with my biryani.', '2026-07-06 14:30:00'),
(8024, 2005, 1004, 4.6, 4.7, 4.4, 'Beautiful packaging, biryani arrived hot. Great seller.', '2026-07-20 16:00:00'),
(8025, 2038, 1004, 5.0, 5.0, 5.0, 'Been waiting to find biryani like this since I moved to Hyderabad. Worth every rupee!', '2026-07-06 14:00:00'),
(8026, 2039, 1004, 4.8, 5.0, 4.5, 'Mutton dum biryani was fall-off-the-bone tender. Amazing slow-cooked flavour.', '2026-07-06 14:00:00'),
(8027, 2040, 1004, 4.7, 4.8, 4.5, 'Veg biryani was just as good as the mutton. Whole spices done perfectly.', '2026-08-03 14:00:00'),
(8028, 2041, 1004, 4.9, 5.0, 4.8, 'Consistently excellent every Sunday. This is my go-to weekly treat.', '2026-07-06 14:30:00'),
(8029, 2042, 1004, 4.5, 4.6, 4.2, 'Good biryani, could use a touch more salt for my taste but very good overall.', '2026-07-06 15:00:00'),
(8030, 2043, 1004, 4.8, 5.0, 4.5, 'The dum sealing was visible when I opened the pack — that''s real dum biryani technique!', '2026-07-06 15:30:00'),
(8031, 2046, 1004, 4.7, 4.8, 4.4, 'Saturday drop is my weekly ritual. Top quality every time.', '2026-07-20 14:00:00'),
(8032, 2047, 1004, 4.9, 5.0, 4.7, 'Zubeida is incredibly talented. Her biryani is cooked with so much love and skill.', '2026-07-20 14:30:00'),

-- === Restaurant 1005 — Mumbai Street Eats (Ramesh Patil) ===
(8033, 2001, 1005, 4.7, 4.8, 4.3, 'Vada pav tasted exactly like the ones outside CST! Ramesh has nailed the authentic flavour.', '2026-08-28 19:00:00'),
(8034, 2025, 1005, 4.6, 4.7, 4.2, 'Pav bhaji was buttery and delicious. The bread was perfectly toasted.', '2026-08-28 19:30:00'),
(8035, 2038, 1005, 4.5, 4.6, 4.0, 'Classic Mumbai street food. Sev puri was crunchy and fresh. Will order again.', '2026-08-28 18:30:00'),

-- === Restaurant 1006 — Keto Kitchen by Ananya (Ananya Krishnan) ===
(8036, 2001, 1006, 4.8, 5.0, 4.6, 'Finally healthy food that actually tastes good! The cauliflower rice is brilliant.', '2026-08-25 10:00:00'),
(8037, 2002, 1006, 4.9, 5.0, 4.8, 'I have been following a keto diet for 6 months and Ananya''s food is by far the best I have found.', '2026-09-01 10:00:00'),
(8038, 2006, 1006, 4.7, 4.8, 4.5, 'The breakfast bowl kept me full until evening. Genuinely nutritious.', '2026-08-25 09:00:00'),
(8039, 2011, 1006, 4.6, 4.7, 4.4, 'Great for meal prep. Ordered 4 boxes and they lasted the whole week.', '2026-08-25 10:30:00'),
(8040, 2014, 1006, 4.8, 5.0, 4.6, 'The paneer tikka bowl was absolutely packed with flavour. 100% clean eating.', '2026-08-25 11:00:00'),
(8041, 2015, 1006, 4.5, 4.6, 4.2, 'Consistent macros. I love that she includes nutrition info with each drop.', '2026-09-01 09:30:00'),
(8042, 2016, 1006, 4.7, 4.8, 4.4, 'The zucchini lasagna was incredibly creative. Keto comfort food — who knew!', '2026-09-01 10:30:00'),

-- === Restaurant 1007 — Udupi Home Kitchen (Suresh Kamath) ===
(8043, 2001, 1007, 4.8, 5.0, 4.5, 'The masala dosa was crisp, the potato filling perfectly spiced. Suresh is a gem.', '2026-08-24 10:30:00'),
(8044, 2003, 1007, 4.7, 4.8, 4.4, 'Idli was soft and fresh, sambar was flavourful. Better than most restaurants!', '2026-08-24 10:00:00'),
(8045, 2007, 1007, 5.0, 5.0, 5.0, 'Udupi food is hard to find outside Karnataka. Suresh''s kitchen is a treasure.', '2026-08-24 09:30:00'),
(8046, 2019, 1007, 4.6, 4.7, 4.3, 'The filter coffee was exceptional — thick decoction, perfectly sweetened.', '2026-09-01 09:30:00'),
(8047, 2020, 1007, 4.9, 5.0, 4.7, 'Medu vada was perfectly crispy outside, fluffy inside. Exactly right.', '2026-08-24 11:00:00'),
(8048, 2021, 1007, 4.7, 4.8, 4.5, 'Upma was made with love — not the dry, bland kind you get in cafeterias.', '2026-09-01 09:00:00'),
(8049, 2022, 1007, 4.5, 4.6, 4.2, 'Nice home-style South Indian breakfast. Chutneys were amazing.', '2026-09-01 10:30:00'),

-- === Restaurant 1008 — Nobo's Sweet Corner (Noboru Chatterjee) ===
(8050, 2001, 1008, 4.9, 5.0, 4.8, 'The sandesh is divine. Best Bengali sweets outside Kolkata, I guarantee it.', '2026-08-10 13:00:00'),
(8051, 2003, 1008, 4.8, 5.0, 4.6, 'Rasgulla was perfectly spongy and soaked in just the right amount of syrup.', '2026-08-10 13:30:00'),
(8052, 2005, 1008, 5.0, 5.0, 5.0, 'Every single sweet was perfection. The misti doi was like a hug in a bowl.', '2026-08-10 12:30:00'),
(8053, 2007, 1008, 4.7, 4.8, 4.5, 'The mishti collection for Durga Puja was spectacular. Gifted a box to family — everyone loved it.', '2026-08-24 13:00:00'),
(8054, 2009, 1008, 4.8, 5.0, 4.6, 'Noboru is clearly very passionate about preserving authentic Bengali sweet-making traditions.', '2026-08-24 13:30:00'),
(8055, 2011, 1008, 4.6, 4.7, 4.4, 'Good variety of sweets. The malai chop was especially creamy and light.', '2026-09-01 13:00:00'),
(8056, 2013, 1008, 4.9, 5.0, 4.7, 'Festival box was beautifully packed and everything tasted authentic.', '2026-08-24 12:30:00'),
(8057, 2015, 1008, 4.7, 4.8, 4.5, 'Can''t believe this quality comes from a home kitchen. Exceptional.', '2026-08-10 12:00:00'),
(8058, 2017, 1008, 4.5, 4.6, 4.2, 'Sweets were very fresh and not too sweet — perfectly balanced.', '2026-08-24 14:00:00'),
(8059, 2019, 1008, 4.8, 5.0, 4.6, 'The autumn collection was inspired. Each sweet told a seasonal story.', '2026-09-01 14:00:00'),
(8060, 2021, 1008, 4.6, 4.7, 4.3, 'Sondesh in the latest drop was incredibly delicate and flavourful.', '2026-09-01 13:30:00'),

-- === Restaurant 1009 — Green Bowl by Meera (Meera Iyer) ===
(8061, 2002, 1009, 4.7, 4.8, 4.5, 'The Protein Bowl is incredible — nutritious, filling, and genuinely delicious.', '2026-09-01 14:00:00'),
(8062, 2004, 1009, 4.6, 4.7, 4.3, 'Great detox options. The salads actually taste good — not just healthy rabbit food.', '2026-09-01 13:30:00'),
(8063, 2006, 1009, 4.8, 5.0, 4.6, 'Meera understands nutrition without sacrificing flavour. Rare find on this platform.', '2026-09-01 14:30:00'),
(8064, 2008, 1009, 4.5, 4.6, 4.2, 'The smoothie bowls were beautiful and fresh. Very Instagrammable too!', '2026-09-01 13:00:00'),
(8065, 2010, 1009, 4.9, 5.0, 4.8, 'Have tried all her drops so far. Every single one has been excellent.', '2026-09-01 15:00:00'),

-- === Restaurant 1010 — Pasta e Basta (Valentina Romano) ===
(8066, 2010, 1010, 4.9, 5.0, 4.7, 'The carbonara was authentic Roman-style — real guanciale, no cream. Valentina knows her Italian.', '2026-08-27 21:00:00'),
(8067, 2012, 1010, 4.8, 5.0, 4.6, 'Best pasta I have had outside of a proper Italian restaurant. Fresh, handmade, incredible.', '2026-08-27 21:30:00'),
(8068, 2014, 1010, 4.7, 4.8, 4.5, 'Pappardelle was cooked perfectly al dente. Ragù was deeply flavoured.', '2026-08-27 20:30:00'),
(8069, 2016, 1010, 4.6, 4.7, 4.4, 'The arancini were crispy, cheesy perfection. Great sides alongside the pasta.', '2026-09-03 21:00:00'),
(8070, 2018, 1010, 4.8, 5.0, 4.6, 'Tiramisu was the real deal. Coffee-soaked, creamy layers. A perfect end to an Italian meal.', '2026-08-27 22:00:00'),

-- === Restaurant 1011 — Jai Ho Kitchen (Jayesh Patel) ===
(8071, 2025, 1011, 4.7, 4.8, 4.4, 'The Gujarati Thali was fantastic — dal, sabzi, roti, everything freshly prepared.', '2026-09-01 14:00:00'),
(8072, 2030, 1011, 4.8, 5.0, 4.5, 'Undhiyu was perfectly spiced with methi muthiya that crumbled just right.', '2026-09-01 13:30:00'),
(8073, 2035, 1011, 4.5, 4.6, 4.2, 'Gujarati food done right. Dhokla was fluffy and perfectly sour.', '2026-09-01 14:30:00'),
(8074, 2040, 1011, 4.6, 4.7, 4.3, 'Wholesome and tasty. Kadhi was light and flavourful — comfort food at its best.', '2026-09-01 15:00:00'),

-- === Restaurant 1012 — Himalayan Dumplings (Tenzin Wangchuk) ===
(8075, 2040, 1012, 4.9, 5.0, 4.7, 'These momos are life-changing! Thin wrappers, juicy filling, amazing chutney.', '2026-09-07 21:00:00'),
(8076, 2041, 1012, 4.8, 5.0, 4.6, 'The jhol momo broth was warming and deeply flavoured. Absolutely perfect for a rainy day.', '2026-09-07 21:30:00'),
(8077, 2042, 1012, 4.7, 4.8, 4.5, 'Best momos outside the Northeast. Tenzin is clearly a master of his craft.', '2026-09-07 20:30:00'),

-- === Restaurant 1013 — Casa de Goa (Francisca Fernandes) ===
(8078, 2015, 1013, 4.8, 5.0, 4.6, 'The bebinca was heavenly — layers of coconut and egg perfectly caramelised.', '2026-08-31 12:00:00'),
(8079, 2025, 1013, 4.7, 4.8, 4.5, 'Pão de Lo cake was beautifully moist with that distinctive Goan flavour.', '2026-08-31 11:30:00'),
(8080, 2035, 1013, 4.6, 4.7, 4.3, 'Dodol was perfectly chewy and rich with jaggery. Hard to find outside Goa.', '2026-08-31 12:30:00'),
(8081, 2045, 1013, 4.9, 5.0, 4.8, 'Francisca''s sweets are a slice of Goan heritage. Every piece was special.', '2026-08-31 13:00:00'),
(8082, 2013, 1013, 4.5, 4.6, 4.2, 'The banana cake was moist and fragrant. Would love to see more Goan recipes.', '2026-09-06 11:00:00'),

-- === Restaurant 1014 — Kerala Kitchen (Lekha Menon) ===
(8083, 2002, 1014, 4.9, 5.0, 4.8, 'The Onam sadya was a true feast — over 15 dishes, every one cooked to perfection.', '2026-08-17 13:00:00'),
(8084, 2004, 1014, 4.8, 5.0, 4.6, 'Prawn curry in coconut milk was absolutely divine. Restaurant-quality for sure.', '2026-09-07 14:00:00'),
(8085, 2006, 1014, 4.7, 4.8, 4.5, 'Kozhikodan biryani is a totally different style from Hyderabadi — equally amazing.', '2026-09-07 13:30:00'),
(8086, 2008, 1014, 5.0, 5.0, 5.0, 'Lekha is an exceptional cook. The karimeen pollichathu was perfection — smoky, tangy, incredible.', '2026-09-07 13:00:00'),
(8087, 2010, 1014, 4.8, 5.0, 4.6, 'Kerala breakfast box was the best morning meal I''ve had. Appam with stew is a masterpiece.', '2026-08-31 10:00:00'),
(8088, 2012, 1014, 4.6, 4.7, 4.4, 'Puttu and kadala curry were perfectly paired. Will definitely order again.', '2026-08-31 10:30:00'),
(8089, 2014, 1014, 4.7, 4.8, 4.5, 'The sadya banana leaf presentation was a lovely touch — very authentic.', '2026-09-07 14:30:00'),
(8090, 2016, 1014, 4.5, 4.6, 4.2, 'Good flavours, fresh ingredients. Kerala food done with real care.', '2026-08-17 12:30:00'),

-- === Restaurant 1015 — Aaroha Millets (Aaroha Reddy) ===
(8091, 2030, 1015, 4.7, 4.8, 4.5, 'So refreshing to find nutritious millet-based food that actually tastes wonderful.', '2026-09-07 11:00:00'),
(8092, 2040, 1015, 4.6, 4.7, 4.3, 'The ragi laddoo was perfectly sweet and dense. Ancient grains, modern flavour.', '2026-09-07 11:30:00'),
(8093, 2045, 1015, 4.8, 5.0, 4.6, 'Jowar bhakri with peanut chutney was a revelation. I will never buy supermarket bread again.', '2026-09-07 10:30:00');

-- ============================================================
-- SECTION 13: NOTIFICATIONS
-- Types: DROP_ANNOUNCED, DROP_OPEN, DROP_CLOSING_SOON,
--        ORDER_CONFIRMED, ORDER_READY, ORDER_CANCELLED,
--        NEW_FOLLOWER, LOW_STOCK
-- reference_type: DROP | ORDER | USER
-- ============================================================
INSERT INTO notifications (notification_id, user_id, type, title, message, reference_type, reference_id, is_read, created_at) VALUES
-- === NEW_FOLLOWER notifications to creators ===
(9001, 1001, 'NEW_FOLLOWER', 'New follower!', 'Arjun Mehta is now following The Artisan Oven.',             'USER', 2001, TRUE,  '2026-07-05 09:00:00'),
(9002, 1001, 'NEW_FOLLOWER', 'New follower!', 'Sneha Desai is now following The Artisan Oven.',             'USER', 2002, TRUE,  '2026-07-06 09:00:00'),
(9003, 1001, 'NEW_FOLLOWER', 'New follower!', 'Rahul Verma is now following The Artisan Oven.',             'USER', 2003, TRUE,  '2026-07-07 09:00:00'),
(9004, 1001, 'NEW_FOLLOWER', 'New follower!', 'Pooja Iyer is now following The Artisan Oven.',              'USER', 2004, TRUE,  '2026-07-08 09:00:00'),
(9005, 1001, 'NEW_FOLLOWER', 'New follower!', 'Vikram Singh is now following The Artisan Oven.',            'USER', 2005, TRUE,  '2026-07-09 09:00:00'),
(9006, 1004, 'NEW_FOLLOWER', 'New follower!', 'Arjun Mehta is now following Hyderabadi Dum House.',        'USER', 2001, TRUE,  '2026-06-10 09:00:00'),
(9007, 1004, 'NEW_FOLLOWER', 'New follower!', 'Sneha Desai is now following Hyderabadi Dum House.',        'USER', 2002, TRUE,  '2026-06-11 09:00:00'),
(9008, 1004, 'NEW_FOLLOWER', 'New follower!', 'Priyanka Joshi is now following Hyderabadi Dum House.',     'USER', 2038, TRUE,  '2026-06-12 09:00:00'),
(9009, 1004, 'NEW_FOLLOWER', 'New follower!', 'Karan Gupta is now following Hyderabadi Dum House.',        'USER', 2039, TRUE,  '2026-06-13 09:00:00'),
(9010, 1006, 'NEW_FOLLOWER', 'New follower!', 'Arjun Mehta is now following Keto Kitchen by Ananya.',      'USER', 2001, TRUE,  '2026-07-01 09:00:00'),
(9011, 1006, 'NEW_FOLLOWER', 'New follower!', 'Sneha Desai is now following Keto Kitchen by Ananya.',      'USER', 2002, TRUE,  '2026-07-02 09:00:00'),
(9012, 1008, 'NEW_FOLLOWER', 'New follower!', 'Arjun Mehta is now following Nobo''s Sweet Corner.',        'USER', 2001, TRUE,  '2026-07-15 09:00:00'),
(9013, 1008, 'NEW_FOLLOWER', 'New follower!', 'Rahul Verma is now following Nobo''s Sweet Corner.',        'USER', 2003, TRUE,  '2026-07-16 09:00:00'),
(9014, 1014, 'NEW_FOLLOWER', 'New follower!', 'Sneha Desai is now following Kerala Kitchen.',              'USER', 2002, TRUE,  '2026-07-20 09:00:00'),
(9015, 1014, 'NEW_FOLLOWER', 'New follower!', 'Pooja Iyer is now following Kerala Kitchen.',               'USER', 2004, TRUE,  '2026-07-21 09:00:00'),

-- === DROP_ANNOUNCED notifications ===
(9016, 2001, 'DROP_ANNOUNCED', 'Drop Announced: Artisan Bakes Vol. 8', 'The Artisan Oven just announced their next bake drop! Sourdough, croissants and more. Pre-orders open soon.', 'DROP', 4001, TRUE, '2026-08-08 10:00:00'),
(9017, 2002, 'DROP_ANNOUNCED', 'Drop Announced: Artisan Bakes Vol. 8', 'The Artisan Oven just announced their next bake drop! Sourdough, croissants and more. Pre-orders open soon.', 'DROP', 4001, TRUE, '2026-08-08 10:01:00'),
(9018, 2003, 'DROP_ANNOUNCED', 'Drop Announced: Artisan Bakes Vol. 8', 'The Artisan Oven just announced their next bake drop! Sourdough, croissants and more. Pre-orders open soon.', 'DROP', 4001, TRUE, '2026-08-08 10:02:00'),
(9019, 2001, 'DROP_ANNOUNCED', 'Drop Announced: Hyderabad Eid Special Biryani', 'Hyderabadi Dum House is cooking a special Eid biryani! Limited portions — order fast.', 'DROP', 4012, TRUE, '2026-07-01 10:00:00'),
(9020, 2002, 'DROP_ANNOUNCED', 'Drop Announced: Hyderabad Eid Special Biryani', 'Hyderabadi Dum House is cooking a special Eid biryani! Limited portions — order fast.', 'DROP', 4012, TRUE, '2026-07-01 10:01:00'),
(9021, 2038, 'DROP_ANNOUNCED', 'Drop Announced: Hyderabad Eid Special Biryani', 'Hyderabadi Dum House is cooking a special Eid biryani! Limited portions — order fast.', 'DROP', 4012, TRUE, '2026-07-01 10:02:00'),
(9022, 2001, 'DROP_ANNOUNCED', 'Drop Announced: Keto Monday Meal Prep Box', 'Keto Kitchen by Ananya announced a new meal prep drop! Pre-orders open Sunday.', 'DROP', 4019, TRUE, '2026-08-22 10:00:00'),
(9023, 2002, 'DROP_ANNOUNCED', 'Drop Announced: Keto Monday Meal Prep Box', 'Keto Kitchen by Ananya announced a new meal prep drop! Pre-orders open Sunday.', 'DROP', 4019, TRUE, '2026-08-22 10:01:00'),
(9024, 2001, 'DROP_ANNOUNCED', 'Drop Announced: Durga Puja Mishti Collection', 'Nobo''s Sweet Corner revealed their festive mishti collection. Pre-orders open soon!', 'DROP', 4027, TRUE, '2026-08-20 10:00:00'),
(9025, 2003, 'DROP_ANNOUNCED', 'Drop Announced: Durga Puja Mishti Collection', 'Nobo''s Sweet Corner revealed their festive mishti collection. Pre-orders open soon!', 'DROP', 4027, TRUE, '2026-08-20 10:01:00'),
(9026, 2002, 'DROP_ANNOUNCED', 'Drop Announced: Onam Sadya Experience', 'Kerala Kitchen just announced a full sadya experience for Onam! Very limited slots.', 'DROP', 4043, TRUE, '2026-08-10 10:00:00'),
(9027, 2004, 'DROP_ANNOUNCED', 'Drop Announced: Onam Sadya Experience', 'Kerala Kitchen just announced a full sadya experience for Onam! Very limited slots.', 'DROP', 4043, TRUE, '2026-08-10 10:01:00'),

-- === DROP_OPEN notifications ===
(9028, 2001, 'DROP_OPEN', 'Now Open: Artisan Bakes Vol. 8', 'The Artisan Oven''s drop is now accepting orders! Grab yours before it sells out.', 'DROP', 4001, TRUE, '2026-08-09 09:00:00'),
(9029, 2002, 'DROP_OPEN', 'Now Open: Artisan Bakes Vol. 8', 'The Artisan Oven''s drop is now accepting orders! Grab yours before it sells out.', 'DROP', 4001, TRUE, '2026-08-09 09:01:00'),
(9030, 2003, 'DROP_OPEN', 'Now Open: Artisan Bakes Vol. 8', 'The Artisan Oven''s drop is now accepting orders! Grab yours before it sells out.', 'DROP', 4001, TRUE, '2026-08-09 09:02:00'),
(9031, 2001, 'DROP_OPEN', 'Now Open: Hyderabad Eid Special Biryani', 'Zubeida''s Eid biryani drop is now open! Order before the 3 July cutoff.', 'DROP', 4012, TRUE, '2026-07-02 09:00:00'),
(9032, 2038, 'DROP_OPEN', 'Now Open: Hyderabad Eid Special Biryani', 'Zubeida''s Eid biryani drop is now open! Order before the 3 July cutoff.', 'DROP', 4012, TRUE, '2026-07-02 09:01:00'),
(9033, 2001, 'DROP_OPEN', 'Now Open: Keto Monday Meal Prep Box', 'Ananya''s Keto Monday drop is open! Secure your healthy meals for the week.', 'DROP', 4019, TRUE, '2026-08-23 09:00:00'),
(9034, 2002, 'DROP_OPEN', 'Now Open: Keto Monday Meal Prep Box', 'Ananya''s Keto Monday drop is open! Secure your healthy meals for the week.', 'DROP', 4019, TRUE, '2026-08-23 09:01:00'),
(9035, 2001, 'DROP_OPEN', 'Now Open: Durga Puja Mishti Collection', 'Nobo''s festival mishti drop is open! Order your sweets before the cutoff.', 'DROP', 4027, TRUE, '2026-08-21 09:00:00'),
(9036, 2003, 'DROP_OPEN', 'Now Open: Durga Puja Mishti Collection', 'Nobo''s festival mishti drop is open! Order your sweets before the cutoff.', 'DROP', 4027, TRUE, '2026-08-21 09:01:00'),
(9037, 2002, 'DROP_OPEN', 'Now Open: Onam Sadya Experience', 'Kerala Kitchen''s Onam sadya is now taking orders. Only 20 sadyas available!', 'DROP', 4043, TRUE, '2026-08-11 09:00:00'),
(9038, 2004, 'DROP_OPEN', 'Now Open: Onam Sadya Experience', 'Kerala Kitchen''s Onam sadya is now taking orders. Only 20 sadyas available!', 'DROP', 4043, TRUE, '2026-08-11 09:01:00'),

-- === DROP_CLOSING_SOON notifications ===
(9039, 2007, 'DROP_CLOSING_SOON', 'Closing Soon: Artisan Bakes Vol. 8', 'Only 1 hour left to order from The Artisan Oven''s bake drop!', 'DROP', 4001, TRUE, '2026-08-10 20:00:00'),
(9040, 2013, 'DROP_CLOSING_SOON', 'Closing Soon: Artisan Bakes Vol. 8', 'Only 1 hour left to order from The Artisan Oven''s bake drop!', 'DROP', 4001, TRUE, '2026-08-10 20:01:00'),
(9041, 2039, 'DROP_CLOSING_SOON', 'Closing Soon: Hyderabad Eid Special Biryani', 'Last chance! Zubeida''s Eid biryani closes in 1 hour.', 'DROP', 4012, TRUE, '2026-07-03 20:00:00'),
(9042, 2040, 'DROP_CLOSING_SOON', 'Closing Soon: Hyderabad Eid Special Biryani', 'Last chance! Zubeida''s Eid biryani closes in 1 hour.', 'DROP', 4012, TRUE, '2026-07-03 20:01:00'),
(9043, 2006, 'DROP_CLOSING_SOON', 'Closing Soon: Keto Monday Meal Prep Box', 'Only 1 hour left to order Ananya''s Keto meal prep!', 'DROP', 4019, TRUE, '2026-08-24 20:00:00'),
(9044, 2011, 'DROP_CLOSING_SOON', 'Closing Soon: Keto Monday Meal Prep Box', 'Only 1 hour left to order Ananya''s Keto meal prep!', 'DROP', 4019, TRUE, '2026-08-24 20:01:00'),
(9045, 2007, 'DROP_CLOSING_SOON', 'Closing Soon: Durga Puja Mishti Collection', 'Last chance to order Nobo''s festival sweets — closing in 1 hour!', 'DROP', 4027, TRUE, '2026-08-23 20:00:00'),
(9046, 2009, 'DROP_CLOSING_SOON', 'Closing Soon: Durga Puja Mishti Collection', 'Last chance to order Nobo''s festival sweets — closing in 1 hour!', 'DROP', 4027, TRUE, '2026-08-23 20:01:00'),

-- === ORDER_CONFIRMED notifications ===
(9047, 2001, 'ORDER_CONFIRMED', 'Order Confirmed!', 'Your order #5001 from The Artisan Oven is confirmed. Pickup on 11 Aug around 10:00 AM.', 'ORDER', 5001, TRUE, '2026-08-09 10:15:00'),
(9048, 2002, 'ORDER_CONFIRMED', 'Order Confirmed!', 'Your order #5002 from The Artisan Oven is confirmed. Pickup on 11 Aug around 10:00 AM.', 'ORDER', 5002, TRUE, '2026-08-09 10:45:00'),
(9049, 2038, 'ORDER_CONFIRMED', 'Order Confirmed!', 'Your order #5045 from Hyderabadi Dum House is confirmed. Pickup on 6 Jul from 1:00 PM.', 'ORDER', 5045, TRUE, '2026-07-02 11:00:00'),
(9050, 2039, 'ORDER_CONFIRMED', 'Order Confirmed!', 'Your order #5046 from Hyderabadi Dum House is confirmed. Pickup on 6 Jul from 1:00 PM.', 'ORDER', 5046, TRUE, '2026-07-02 11:30:00'),
(9051, 2001, 'ORDER_CONFIRMED', 'Order Confirmed!', 'Your order #5082 from Keto Kitchen by Ananya is confirmed. Pickup on 25 Aug from 8:00 AM.', 'ORDER', 5082, TRUE, '2026-08-23 09:30:00'),
(9052, 2001, 'ORDER_CONFIRMED', 'Order Confirmed!', 'Your order #5106 from Nobo''s Sweet Corner is confirmed. Pickup on 10 Aug from 11:00 AM.', 'ORDER', 5106, TRUE, '2026-08-10 09:00:00'),
(9053, 2002, 'ORDER_CONFIRMED', 'Order Confirmed!', 'Your order #5175 from Kerala Kitchen is confirmed. Pickup on 17 Aug during Onam sadya window.', 'ORDER', 5175, TRUE, '2026-08-11 10:00:00'),
(9054, 2004, 'ORDER_CONFIRMED', 'Order Confirmed!', 'Your order #5176 from Kerala Kitchen is confirmed. Pickup on 17 Aug during Onam sadya window.', 'ORDER', 5176, TRUE, '2026-08-11 10:30:00'),

-- === ORDER_READY notifications ===
(9055, 2001, 'ORDER_READY', 'Ready for Pickup!', 'Your order #5001 from The Artisan Oven is ready! Please collect it today between 10:00 AM – 12:00 PM.', 'ORDER', 5001, TRUE, '2026-08-11 10:00:00'),
(9056, 2002, 'ORDER_READY', 'Ready for Pickup!', 'Your order #5002 from The Artisan Oven is ready! Please collect it today between 10:00 AM – 12:00 PM.', 'ORDER', 5002, TRUE, '2026-08-11 10:00:00'),
(9057, 2003, 'ORDER_READY', 'Ready for Pickup!', 'Your order #5003 from The Artisan Oven is ready! Please collect it today between 10:00 AM – 12:00 PM.', 'ORDER', 5003, TRUE, '2026-08-11 10:00:00'),
(9058, 2038, 'ORDER_READY', 'Ready for Pickup!', 'Your order #5045 from Hyderabadi Dum House is ready! Pickup today from 1:00 PM – 3:00 PM.', 'ORDER', 5045, TRUE, '2026-07-06 13:00:00'),
(9059, 2039, 'ORDER_READY', 'Ready for Pickup!', 'Your order #5046 from Hyderabadi Dum House is ready! Pickup today from 1:00 PM – 3:00 PM.', 'ORDER', 5046, TRUE, '2026-07-06 13:00:00'),
(9060, 2001, 'ORDER_READY', 'Ready for Pickup!', 'Your order #5082 from Keto Kitchen by Ananya is ready! Pickup 8:00 AM – 9:00 AM.', 'ORDER', 5082, TRUE, '2026-08-25 08:00:00'),
(9061, 2001, 'ORDER_READY', 'Ready for Pickup!', 'Your order #5106 from Nobo''s Sweet Corner is ready! Pickup 11:00 AM – 1:00 PM.', 'ORDER', 5106, TRUE, '2026-08-10 11:00:00'),
(9062, 2002, 'ORDER_READY', 'Ready for Pickup!', 'Your order #5175 from Kerala Kitchen is ready! Pickup any time during the sadya window.', 'ORDER', 5175, TRUE, '2026-08-17 11:00:00'),

-- === ORDER_CANCELLED notifications ===
(9063, 2001, 'ORDER_CANCELLED', 'Order Cancelled', 'Your order #5006 from The Artisan Oven was cancelled. Refund will be processed within 3–5 business days.', 'ORDER', 5006, TRUE, '2026-08-10 18:00:00'),
(9064, 2003, 'ORDER_CANCELLED', 'Order Cancelled', 'Your order #5016 from Maa Ki Rasoi was cancelled. Refund has been initiated.', 'ORDER', 5016, TRUE, '2026-08-24 18:00:00'),
(9065, 2041, 'ORDER_CANCELLED', 'Order Cancelled', 'Your order #5052 from Hyderabadi Dum House was cancelled. We apologise for the inconvenience.', 'ORDER', 5052, TRUE, '2026-07-04 10:00:00'),
(9066, 2047, 'ORDER_CANCELLED', 'Order Cancelled', 'Your order #5068 from Hyderabadi Dum House was cancelled. Refund initiated.', 'ORDER', 5068, TRUE, '2026-08-02 10:00:00'),
(9067, 2001, 'ORDER_CANCELLED', 'Order Cancelled', 'Your order #5130 from Nobo''s Sweet Corner was cancelled. Refund has been initiated.', 'ORDER', 5130, TRUE, '2026-09-01 18:00:00'),

-- === LOW_STOCK notifications to creators ===
(9068, 1001, 'LOW_STOCK', 'Low Stock Alert', 'Sourdough Loaf in Artisan Bakes Vol. 8 is almost sold out — only 2 portions remaining.', 'DROP', 4001, TRUE, '2026-08-10 15:00:00'),
(9069, 1004, 'LOW_STOCK', 'Low Stock Alert', 'Mutton Dum Biryani in the Eid Special drop is almost sold out — only 3 portions remaining.', 'DROP', 4012, TRUE, '2026-07-03 12:00:00'),
(9070, 1004, 'LOW_STOCK', 'Low Stock Alert', 'Chicken Biryani in Sunday Biryani Drop is down to last 4 portions. Close orders soon.', 'DROP', 4013, TRUE, '2026-07-19 14:00:00'),
(9071, 1008, 'LOW_STOCK', 'Low Stock Alert', 'Rasgulla in Bengali Sweets Drop is running low — only 3 boxes remaining.', 'DROP', 4026, TRUE, '2026-08-10 09:00:00'),
(9072, 1014, 'LOW_STOCK', 'Low Stock Alert', 'Full Onam Sadya (Veg) is almost sold out — only 2 portions left!', 'DROP', 4043, TRUE, '2026-08-14 10:00:00'),

-- === Unread notifications for currently OPEN drops ===
(9073, 2001, 'DROP_OPEN', 'Now Open: Artisan Seasonal Bakes — Autumn', 'The Artisan Oven''s latest autumn drop is now taking orders!', 'DROP', 4005, FALSE, '2026-09-06 09:00:00'),
(9074, 2002, 'DROP_OPEN', 'Now Open: Artisan Seasonal Bakes — Autumn', 'The Artisan Oven''s latest autumn drop is now taking orders!', 'DROP', 4005, FALSE, '2026-09-06 09:01:00'),
(9075, 2003, 'DROP_OPEN', 'Now Open: Artisan Seasonal Bakes — Autumn', 'The Artisan Oven''s latest autumn drop is now taking orders!', 'DROP', 4005, FALSE, '2026-09-06 09:02:00'),
(9076, 2038, 'DROP_OPEN', 'Now Open: Zubeida''s Biryani Express — Weekend Drop', 'Hyderabadi Dum House weekend drop is open. Limited to 30 portions only!', 'DROP', 4015, FALSE, '2026-09-05 09:00:00'),
(9077, 2039, 'DROP_OPEN', 'Now Open: Zubeida''s Biryani Express — Weekend Drop', 'Hyderabadi Dum House weekend drop is open. Limited to 30 portions only!', 'DROP', 4015, FALSE, '2026-09-05 09:01:00'),
(9078, 2001, 'DROP_OPEN', 'Now Open: Keto Power Bowl Series', 'Ananya''s new keto power bowl series is open for orders this week!', 'DROP', 4021, FALSE, '2026-09-07 09:00:00'),
(9079, 2002, 'DROP_OPEN', 'Now Open: Keto Power Bowl Series', 'Ananya''s new keto power bowl series is open for orders this week!', 'DROP', 4021, FALSE, '2026-09-07 09:01:00'),
(9080, 2002, 'DROP_OPEN', 'Now Open: Kerala Seafood & Biryani Festival', 'Kerala Kitchen is running a seafood festival drop this weekend!', 'DROP', 4047, FALSE, '2026-09-08 09:00:00'),
(9081, 2004, 'DROP_OPEN', 'Now Open: Kerala Seafood & Biryani Festival', 'Kerala Kitchen is running a seafood festival drop this weekend!', 'DROP', 4047, FALSE, '2026-09-08 09:01:00');

-- ============================================================
-- SECTION 14: REELS
-- (restaurant_id, title, media_url, view_count)
-- Each active creator has 2-4 reels promoting their food drops
-- ============================================================
INSERT INTO reels (reel_id, restaurant_id, title, media_url, view_count, created_at) VALUES
-- === The Artisan Oven (1001) ===
(10001, 1001, 'How I make my legendary sourdough loaf at home', 'https://storage.foodflow.dev/reels/1001/sourdough_process.mp4', 3420, '2026-08-05 10:00:00'),
(10002, 1001, 'Croissant lamination in 60 seconds — look at those layers!', 'https://storage.foodflow.dev/reels/1001/croissant_layers.mp4', 5120, '2026-08-07 10:00:00'),
(10003, 1001, 'Autumn flavours: Cinnamon Apple Galette revealed!', 'https://storage.foodflow.dev/reels/1001/apple_galette.mp4', 2810, '2026-09-04 11:00:00'),

-- === Maa Ki Rasoi (1002) ===
(10004, 1002, 'Slow-cooking dal makhani the traditional way — 8 hours on the chulha', 'https://storage.foodflow.dev/reels/1002/dal_makhani_slow.mp4', 2950, '2026-08-15 09:00:00'),
(10005, 1002, 'Aloo paratha mornings — watch how I make them flaky!', 'https://storage.foodflow.dev/reels/1002/aloo_paratha.mp4', 1840, '2026-08-22 09:00:00'),

-- === Hyderabadi Dum House (1004) ===
(10006, 1004, 'Dum sealing technique — this is how we trap the steam for perfect biryani', 'https://storage.foodflow.dev/reels/1004/dum_sealing.mp4', 8750, '2026-06-28 11:00:00'),
(10007, 1004, 'The 3-hour marinade that makes my mutton biryani legendary', 'https://storage.foodflow.dev/reels/1004/mutton_marinade.mp4', 6320, '2026-07-12 10:00:00'),
(10008, 1004, 'Sunday biryani prep — from raw rice to perfect dum in one reel', 'https://storage.foodflow.dev/reels/1004/sunday_prep.mp4', 4210, '2026-07-16 09:30:00'),
(10009, 1004, 'Mirchi ka salan — the biryani''s perfect partner', 'https://storage.foodflow.dev/reels/1004/mirchi_salan.mp4', 3150, '2026-07-30 10:00:00'),

-- === Mumbai Street Eats (1005) ===
(10010, 1005, 'Authentic vada pav — garlic chutney is the real hero here', 'https://storage.foodflow.dev/reels/1005/vada_pav_secret.mp4', 4620, '2026-08-22 17:00:00'),
(10011, 1005, 'Pav bhaji loading — the butter makes all the difference!', 'https://storage.foodflow.dev/reels/1005/pav_bhaji_loading.mp4', 3180, '2026-09-04 16:00:00'),

-- === Keto Kitchen by Ananya (1006) ===
(10012, 1006, 'How to make cauliflower rice that actually tastes amazing', 'https://storage.foodflow.dev/reels/1006/cauli_rice.mp4', 5430, '2026-08-18 08:00:00'),
(10013, 1006, 'My weekly keto meal prep — 5 days of clean eating in 60 seconds', 'https://storage.foodflow.dev/reels/1006/weekly_prep.mp4', 7890, '2026-08-28 08:00:00'),
(10014, 1006, 'Keto Power Bowl reveal — new menu for next drop!', 'https://storage.foodflow.dev/reels/1006/power_bowl_reveal.mp4', 3210, '2026-09-05 09:00:00'),

-- === Udupi Home Kitchen (1007) ===
(10015, 1007, 'Paper dosa spreading technique — thin as a crepe, crispy as a chip!', 'https://storage.foodflow.dev/reels/1007/paper_dosa.mp4', 6150, '2026-08-18 07:30:00'),
(10016, 1007, 'Coconut chutney in 2 minutes — fresh, no preservatives', 'https://storage.foodflow.dev/reels/1007/coconut_chutney.mp4', 3470, '2026-08-25 07:30:00'),
(10017, 1007, 'Filter coffee the Udupi way — decoction to cup', 'https://storage.foodflow.dev/reels/1007/filter_coffee.mp4', 4920, '2026-09-01 07:30:00'),

-- === Nobo's Sweet Corner (1008) ===
(10018, 1008, 'How to make sandesh with the perfect texture — chena secrets revealed', 'https://storage.foodflow.dev/reels/1008/sandesh_technique.mp4', 4350, '2026-08-03 10:00:00'),
(10019, 1008, 'The rasgulla sponge test — if it bounces, it''s perfect!', 'https://storage.foodflow.dev/reels/1008/rasgulla_test.mp4', 5620, '2026-08-17 10:00:00'),
(10020, 1008, 'Durga Puja mishti box — unwrapping the festival collection!', 'https://storage.foodflow.dev/reels/1008/puja_collection.mp4', 7840, '2026-08-21 10:00:00'),
(10021, 1008, 'Autumn sondesh collection — each one hand-shaped and unique', 'https://storage.foodflow.dev/reels/1008/autumn_sondesh.mp4', 3150, '2026-08-29 10:00:00'),

-- === Green Bowl by Meera (1009) ===
(10022, 1009, 'My detox smoothie bowl prep — no sugar, all nutrition', 'https://storage.foodflow.dev/reels/1009/smoothie_bowl.mp4', 4810, '2026-08-28 08:00:00'),
(10023, 1009, 'Protein bowl assembly — 35g protein in one bowl!', 'https://storage.foodflow.dev/reels/1009/protein_bowl.mp4', 6230, '2026-09-02 08:00:00'),

-- === Pasta e Basta (1010) ===
(10024, 1010, 'Fresh pasta from scratch — this is how Romans do it!', 'https://storage.foodflow.dev/reels/1010/fresh_pasta.mp4', 7140, '2026-08-20 18:00:00'),
(10025, 1010, 'Real carbonara — no cream! Just egg, pecorino and guanciale', 'https://storage.foodflow.dev/reels/1010/real_carbonara.mp4', 9320, '2026-08-25 18:00:00'),
(10026, 1010, 'Tiramisu assembly — ladyfingers and mascarpone magic', 'https://storage.foodflow.dev/reels/1010/tiramisu.mp4', 5450, '2026-09-01 18:00:00'),

-- === Jai Ho Kitchen (1011) ===
(10027, 1011, 'Gujarati Thali reveal — 12 items prepared fresh every Sunday', 'https://storage.foodflow.dev/reels/1011/thali_reveal.mp4', 3680, '2026-08-27 09:00:00'),
(10028, 1011, 'Undhiyu from scratch — the Surat way', 'https://storage.foodflow.dev/reels/1011/undhiyu.mp4', 2940, '2026-09-04 09:00:00'),

-- === Himalayan Dumplings (1012) ===
(10029, 1012, 'Momo folding technique — 8 pleats in under 10 seconds!', 'https://storage.foodflow.dev/reels/1012/momo_folding.mp4', 8920, '2026-09-01 16:00:00'),
(10030, 1012, 'Jhol momo broth — the real Kathmandu recipe', 'https://storage.foodflow.dev/reels/1012/jhol_broth.mp4', 5670, '2026-09-05 16:00:00'),

-- === Casa de Goa (1013) ===
(10031, 1013, 'Bebinca — 7 layers of Goan tradition and love', 'https://storage.foodflow.dev/reels/1013/bebinca_layers.mp4', 4120, '2026-08-24 10:00:00'),
(10032, 1013, 'Dodol making — the most patient recipe in Goa', 'https://storage.foodflow.dev/reels/1013/dodol_making.mp4', 3350, '2026-08-29 10:00:00'),

-- === Kerala Kitchen (1014) ===
(10033, 1014, 'Full Onam Sadya spread — 24 dishes on a banana leaf!', 'https://storage.foodflow.dev/reels/1014/onam_sadya.mp4', 11420, '2026-08-08 09:00:00'),
(10034, 1014, 'Karimeen Pollichathu — the pearl spot fish wrapped in banana leaf', 'https://storage.foodflow.dev/reels/1014/karimeen.mp4', 6830, '2026-09-01 10:00:00'),
(10035, 1014, 'Kerala biryani vs Hyderabadi biryani — what''s the difference?', 'https://storage.foodflow.dev/reels/1014/kerala_biryani.mp4', 8950, '2026-09-05 10:00:00'),

-- === Aaroha Millets (1015) ===
(10036, 1015, 'Why I cook only with millets — the ancient grain revolution', 'https://storage.foodflow.dev/reels/1015/millet_why.mp4', 3210, '2026-09-01 09:00:00'),
(10037, 1015, 'Ragi laddoo — 3 ingredients, zero guilt', 'https://storage.foodflow.dev/reels/1015/ragi_laddoo.mp4', 4680, '2026-09-05 09:00:00');

-- ============================================================
-- SECTION 15: UPDATE CREATOR VERIFICATION LEVELS
-- Set current_level based on the verification data inserted in
-- SECTION 4 to keep the denormalised field consistent.
-- ============================================================
UPDATE creator_verifications SET
    current_level = 3,
    level_updated_at = '2026-06-20 10:00:00'
WHERE creator_id IN (1004, 1006, 1007, 1008, 1014);

UPDATE creator_verifications SET
    current_level = 2,
    level_updated_at = '2026-07-10 10:00:00'
WHERE creator_id IN (1001, 1002, 1005, 1009, 1010, 1011, 1012, 1013, 1015);

UPDATE creator_verifications SET
    current_level = 1,
    level_updated_at = '2026-08-01 10:00:00'
WHERE creator_id IN (1003);

-- ============================================================
-- SECTION 16: UPDATE RESTAURANT AVERAGE RATINGS
-- Keep the denormalised avg_rating on the restaurants table
-- consistent with the ratings inserted above.
-- ============================================================
UPDATE restaurants SET avg_rating = 4.7 WHERE restaurant_id = 1001;
UPDATE restaurants SET avg_rating = 4.7 WHERE restaurant_id = 1002;
UPDATE restaurants SET avg_rating = 4.8 WHERE restaurant_id = 1004;
UPDATE restaurants SET avg_rating = 4.6 WHERE restaurant_id = 1005;
UPDATE restaurants SET avg_rating = 4.7 WHERE restaurant_id = 1006;
UPDATE restaurants SET avg_rating = 4.8 WHERE restaurant_id = 1007;
UPDATE restaurants SET avg_rating = 4.7 WHERE restaurant_id = 1008;
UPDATE restaurants SET avg_rating = 4.7 WHERE restaurant_id = 1009;
UPDATE restaurants SET avg_rating = 4.8 WHERE restaurant_id = 1010;
UPDATE restaurants SET avg_rating = 4.7 WHERE restaurant_id = 1011;
UPDATE restaurants SET avg_rating = 4.8 WHERE restaurant_id = 1012;
UPDATE restaurants SET avg_rating = 4.7 WHERE restaurant_id = 1013;
UPDATE restaurants SET avg_rating = 4.8 WHERE restaurant_id = 1014;
UPDATE restaurants SET avg_rating = 4.7 WHERE restaurant_id = 1015;

-- ============================================================
-- END OF V35__seed_realistic_dev_data.sql
-- Target row counts (approximate):
--   users             : 65  (15 creators + 50 customers)
--   restaurants       : 15
--   creator_verif.    : 15
--   menu_items        : ~172
--   food_drops        : ~49
--   drop_items        : ~125
--   creator_follows   : ~75
--   orders            : ~205
--   order_items       : ~320
--   payments          : ~205
--   ratings           : 93
--   notifications     : 81
--   reels             : 37
-- ============================================================

const fs = require('fs');
const path = require('path');

const outputPath = path.join('c:', 'dev', 'food_deliveery_food_flow', 'backend', 'src', 'main', 'resources', 'db', 'dev_migration', 'V35__seed_realistic_dev_data.sql');

// Seed Hash
const BCRYPT_HASH = '$2b$10$.hHOrkusrCLciRXEQu6D8eUmtfpTHWSMoe3YMhA08NcA32cPPvHCu'; // FoodFlow@2024

let sql = `-- V35__seed_realistic_dev_data.sql\n`;
sql += `-- Realistic interconnected development data population\n\n`;

const escape = (str) => {
    if (str === null || str === undefined) return 'NULL';
    return "'" + str.replace(/'/g, "''") + "'";
};

const customers = [
    'Arjun Mehta', 'Sneha Desai', 'Rahul Gupta', 'Sneha Nair', 'Vikash Pandey', 
    'Divya Menon', 'Kiran Patel', 'Aakash Verma', 'Riya Shah', 'Suresh Kumar',
    'Pooja Mehta', 'Ankit Joshi', 'Meena Pillai', 'Rohit Agarwal', 'Swathi Krishnan',
    'Abhishek Das', 'Kavya Reddy', 'Siddharth Rao', 'Manisha Bose', 'Nikhil Tiwari',
    'Tanvi Shah', 'Deepak Nambiar', 'Ishita Chatterjee', 'Vishal Kumar', 'Shreya Varma',
    'Gaurav Malhotra', 'Lakshmi Subramaniam', 'Rajiv Kapoor', 'Ankita Singh', 'Mayur Desai',
    'Chandni Mishra', 'Aryan Patel', 'Preeti Nair', 'Saurabh Yadav', 'Bindu Krishnan',
    'Tushar Shah', 'Archana Pillai', 'Vivek Menon', 'Shalini Gupta', 'Pratik Das',
    'Megha Reddy', 'Shivam Jha', 'Hema Kiran', 'Abhinav Roy', 'Padma Sundaram',
    'Kaushal Mehta', 'Ranjana Iyer', 'Pavan Kumar', 'Vaishali Shah', 'Girish Nambiar'
];

const sampleVideos = [
    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
    'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4'
];

const creatorProfiles = [
    { id: 1001, name: 'The Sourdough Story', owner: 'Priya Sharma', city: 'Bangalore', cuisine: 'Bakery', type: 'HOME_BAKER', level: 3, bio: 'Artisan sourdough and pastries.', handle: 'sourdoughstory_blr', lat: '12.9716', lng: '77.5946',
      dishes: ['Classic Sourdough Loaf', 'Jalapeno Cheddar Sourdough', 'Chocolate Babka', 'Almond Croissant', 'Cinnamon Roll', 'Garlic Focaccia', 'Whole Wheat Boule', 'Baguette'] },
    { id: 1002, name: 'Maa Ki Rasoi', owner: 'Aarti Devi', city: 'Delhi', cuisine: 'North Indian', type: 'TIFFIN_SERVICE', level: 2, bio: 'Authentic homestyle North Indian thalis.', handle: 'maakirasoidelhi', lat: '28.7041', lng: '77.1025',
      dishes: ['Rajma Chawal Bowl', 'Aloo Paratha Plate', 'Dal Makhani Combo', 'Kadhai Paneer Thali', 'Chole Bhature', 'Bhindi Masala', 'Jeera Rice', 'Gajar Halwa'] },
    { id: 1003, name: 'Midnight Munchies', owner: 'Rahul Verma', city: 'Mumbai', cuisine: 'Fast Food', type: 'CLOUD_KITCHEN', level: 0, bio: 'Late-night cravings sorted.', handle: 'midnightmunchies_mum', lat: '19.0760', lng: '72.8777',
      dishes: ['Double Cheese Burger', 'Peri Peri Fries', 'Spicy Chicken Wings', 'Veggie Loaded Pizza', 'Chocolate Brownie Shake', 'Cheesy Garlic Bread'] },
    { id: 1004, name: 'Sunday Biryani Club', owner: 'Mohammed Hussain', city: 'Hyderabad', cuisine: 'Hyderabadi', type: 'WEEKEND_CHEF', level: 3, bio: 'Authentic Dum Biryani.', handle: 'sundaybiryaniclub', lat: '17.3850', lng: '78.4867',
      dishes: ['Chicken Dum Biryani', 'Mutton Biryani', 'Mirchi Ka Salan', 'Double Ka Meetha', 'Chicken 65', 'Egg Biryani'] },
    { id: 1005, name: 'Bombay Vada Pav', owner: 'Sanjay Patil', city: 'Pune', cuisine: 'Street Food', type: 'CLOUD_KITCHEN', level: 1, bio: 'Best Vada Pav with secret chutney.', handle: 'bombayvadapav_pune', lat: '18.5204', lng: '73.8567',
      dishes: ['Classic Vada Pav', 'Cheese Vada Pav', 'Misal Pav', 'Kanda Poha', 'Sabudana Khichdi', 'Cutting Chai Thermos'] },
    { id: 1006, name: 'Keto Kitchen', owner: 'Ritu Kapoor', city: 'Bangalore', cuisine: 'Healthy', type: 'HEALTHY_MEALS', level: 2, bio: 'Guilt-free keto meals.', handle: 'ketokitchen_blr', lat: '12.9352', lng: '77.6245',
      dishes: ['Keto Almond Flour Pizza', 'Zucchini Noodles Paneer', 'Avocado Chicken Salad', 'Keto Chocolate Fudge', 'Bulletproof Coffee', 'Cauliflower Rice Bowl'] },
    { id: 1007, name: 'Chennai Spice', owner: 'Karthik Iyer', city: 'Chennai', cuisine: 'South Indian', type: 'TIFFIN_SERVICE', level: 1, bio: 'Filter coffee and crispy dosas.', handle: 'chennaispice_chn', lat: '13.0827', lng: '80.2707',
      dishes: ['Mysore Masala Dosa', 'Idli Sambar', 'Medu Vada 2pc', 'Podi Dosa', 'Filter Coffee Flask', 'Kesari Bath'] },
    { id: 1008, name: 'Bengali Sweets Corner', owner: 'Amit Das', city: 'Kolkata', cuisine: 'Desserts', type: 'SPECIALTY_DESSERTS', level: 3, bio: 'Authentic Rosogolla and Sandesh.', handle: 'bengalisweetscorner', lat: '22.5726', lng: '88.3639',
      dishes: ['Sponge Rosogolla', 'Mishti Doi Matka', 'Kheer Kadam', 'Nolen Gur Sandesh', 'Rasmalai', 'Cham Cham'] },
    { id: 1009, name: 'Fit Bites', owner: 'Neha Singh', city: 'Delhi', cuisine: 'Salads', type: 'HEALTHY_MEALS', level: 2, bio: 'Power bowls for fitness enthusiasts.', handle: 'fitbites_delhi', lat: '28.5355', lng: '77.2639',
      dishes: ['Quinoa Salad Bowl', 'Grilled Chicken Salad', 'Tofu Protein Wrap', 'Green Detox Smoothie', 'Greek Yogurt Parfait', 'Roasted Chickpeas'] },
    { id: 1010, name: 'The Pasta Bar', owner: 'Vikram Mehta', city: 'Mumbai', cuisine: 'Italian', type: 'CLOUD_KITCHEN', level: 2, bio: 'Handmade pasta.', handle: 'thepastabar_mum', lat: '19.0596', lng: '72.8295',
      dishes: ['Penne Arrabbiata', 'Truffle Mushroom Risotto', 'Spaghetti Aglio e Olio', 'Creamy Pesto Pasta', 'Tiramisu Cup', 'Garlic Breadsticks'] },
    { id: 1011, name: 'Gujarati Thali House', owner: 'Bhavna Patel', city: 'Ahmedabad', cuisine: 'Gujarati', type: 'TIFFIN_SERVICE', level: 1, bio: 'Traditional thalis.', handle: 'gujaratithalihouse', lat: '23.0225', lng: '72.5714',
      dishes: ['Mini Gujarati Thali', 'Khaman Dhokla', 'Handvo', 'Undhiyu', 'Shrikhand', 'Thepla Pack'] },
    { id: 1012, name: 'Momos & More', owner: 'Tenzin Gyatso', city: 'Delhi', cuisine: 'Tibetan', type: 'WEEKEND_CHEF', level: 1, bio: 'Steamed and fried momos.', handle: 'momosandmoredelhi', lat: '28.6139', lng: '77.2090',
      dishes: ['Chicken Steamed Momos', 'Veg Fried Momos', 'Paneer Kurkure Momos', 'Thukpa Soup', 'Spicy Chilli Potato', 'Fruit Beer'] },
    { id: 1013, name: 'Bake My Day', owner: 'Sophia Fernandez', city: 'Goa', cuisine: 'Bakery', type: 'HOME_BAKER', level: 2, bio: 'Custom celebration cakes.', handle: 'bakemyday_goa', lat: '15.2993', lng: '74.1240',
      dishes: ['Chocolate Truffle Cake', 'Pineapple Pastry', 'Red Velvet Cupcake', 'Bebinca Slice', 'Chicken Patties', 'Cheese Croissant'] },
    { id: 1014, name: 'Kerala Kitchen', owner: 'Mathew Thomas', city: 'Bangalore', cuisine: 'Kerala', type: 'CLOUD_KITCHEN', level: 3, bio: 'Appam and authentic seafood.', handle: 'keralakitchenblr', lat: '12.9141', lng: '77.6309',
      dishes: ['Kerala Fish Curry', 'Appam and Stew', 'Beef Fry', 'Malabar Parotta', 'Pazham Pori', 'Chicken Roast'] },
    { id: 1015, name: 'Millet Magic', owner: 'Divya Reddy', city: 'Hyderabad', cuisine: 'Healthy', type: 'HEALTHY_MEALS', level: 1, bio: 'Gluten-free ancient grain meals.', handle: 'milletmagic_hyd', lat: '17.4399', lng: '78.4983',
      dishes: ['Ragi Dosa', 'Jowar Roti Meal', 'Millet Pongal', 'Foxtail Millet Upma', 'Millet Choco Cookies', 'Buttermilk'] }
];

const reviewTemplates = [
    { t: "Absolutely loved the {dish}! The flavor was spot on and pickup was super smooth.", r: [4, 5] },
    { t: "The food was fresh and portion sizes were great. Will definitely order again.", r: [4, 5] },
    { t: "A bit too spicy for my taste, but the quality of ingredients was excellent.", r: [3, 4] },
    { t: "My {dish} was packed very neatly. Loved the eco-friendly packaging.", r: [4, 5] },
    { t: "Pickup was delayed by 10 minutes, but the food made up for it.", r: [3, 4] },
    { t: "This is easily the best {dish} I've had in the city. Highly recommended!", r: [5] },
    { t: "Decent food, but a bit overpriced for the quantity.", r: [3] },
    { t: "The texture of the {dish} was perfect. Completely authentic.", r: [4, 5] }
];

const reelTitles = [
    "Behind the scenes in our kitchen",
    "Making our best-seller from scratch",
    "Prep day for the weekend drop!",
    "How we pack your orders",
    "A look at our fresh ingredients",
    "Listen to that crunch!",
    "Fresh out of the oven",
    "The secret behind our signature dish"
];

let customerIds = [];
sql += `\n-- 1. Customers\n`;
customers.forEach((name, i) => {
    let id = 2001 + i;
    customerIds.push(id);
    let email = name.toLowerCase().replace(/ /g, '.') + '@example.com';
    let phone = '98' + String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
    sql += `INSERT INTO users (user_id, name, email, phone, password, role, is_active) VALUES (${id}, ${escape(name)}, ${escape(email)}, ${escape(phone)}, ${escape(BCRYPT_HASH)}, 'CUSTOMER', TRUE);\n`;
});

let creatorIds = [];
sql += `\n-- 2. Creators, Restaurants, Verifications\n`;
creatorProfiles.forEach((c) => {
    creatorIds.push(c.id);
    let email = c.name.toLowerCase().replace(/ /g, '').replace(/&/g,'') + '@creator.com';
    let phone = '99' + String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
    
    sql += `INSERT INTO users (user_id, name, email, phone, password, role, is_active) VALUES (${c.id}, ${escape(c.owner)}, ${escape(email)}, ${escape(phone)}, ${escape(BCRYPT_HASH)}, 'SELLER', TRUE);\n`;
    
    // Note: avg_rating, follower_count, total_orders_completed default to 0 and will be updated later.
    sql += `INSERT INTO restaurants (restaurant_id, owner_id, name, city, cuisine, is_open, creator_type, bio, instagram_handle, verification_level, is_accepting_orders, pickup_address, avg_rating, follower_count, total_orders_completed) VALUES (${c.id}, ${c.id}, ${escape(c.name)}, ${escape(c.city)}, ${escape(c.cuisine)}, TRUE, ${escape(c.type)}, ${escape(c.bio)}, ${escape(c.handle)}, ${c.level}, TRUE, ${escape(c.city + ' Central Area')}, 0.0, 0, 0);\n`;
    
    sql += `INSERT INTO creator_verifications (creator_id, current_level, phone_otp_verified, food_licence_number) VALUES (${c.id}, ${c.level}, TRUE, 'FSSAI-${c.id}');\n`;
});

let menuItems = [];
let nextMenuId = 3001;
sql += `\n-- 3. Menu Items\n`;
creatorProfiles.forEach(c => {
    c.dishes.forEach((dishName) => {
        let isVeg = !dishName.toLowerCase().includes('chicken') && !dishName.toLowerCase().includes('beef') && !dishName.toLowerCase().includes('mutton') && !dishName.toLowerCase().includes('fish');
        let category = 'Main Course';
        if (dishName.toLowerCase().includes('cake') || dishName.toLowerCase().includes('dessert') || dishName.toLowerCase().includes('sweet') || dishName.toLowerCase().includes('rasmalai') || dishName.toLowerCase().includes('halwa')) category = 'Dessert';
        else if (dishName.toLowerCase().includes('fries') || dishName.toLowerCase().includes('wings') || dishName.toLowerCase().includes('vada')) category = 'Starter';
        else if (dishName.toLowerCase().includes('coffee') || dishName.toLowerCase().includes('shake') || dishName.toLowerCase().includes('buttermilk')) category = 'Beverage';
        
        let price = (Math.floor(Math.random() * 30) + 8) * 10; 
        
        sql += `INSERT INTO menu_items (item_id, restaurant_id, name, description, price, is_veg, category, available_qty, is_deleted) VALUES (${nextMenuId}, ${c.id}, ${escape(dishName)}, ${escape('Freshly prepared ' + dishName)}, ${price}, ${isVeg}, ${escape(category)}, 50, FALSE);\n`;
        menuItems.push({ id: nextMenuId, rId: c.id, name: dishName, price });
        nextMenuId++;
    });
});

sql += `\n-- 4. Follows\n`;
customerIds.slice(0, 25).forEach(custId => {
    sql += `INSERT INTO creator_follows (follower_id, creator_id) VALUES (${custId}, 1001);\n`;
});
customerIds.slice(25, 37).forEach(custId => {
    sql += `INSERT INTO creator_follows (follower_id, creator_id) VALUES (${custId}, 1004);\n`;
});
for(let i=0; i<80; i++) {
    let custId = customerIds[Math.floor(Math.random() * customerIds.length)];
    let crId = creatorIds[Math.floor(Math.random() * creatorIds.length)];
    if(crId !== 1001 && crId !== 1004 && crId !== 1003) {
        sql += `INSERT IGNORE INTO creator_follows (follower_id, creator_id) VALUES (${custId}, ${crId});\n`;
    }
}

sql += `\n-- 5. Food Drops & Items\n`;
let nextDropId = 4001;
let nextDropItemId = 4501;
const dropStatuses = ['DRAFT', 'ANNOUNCED', 'OPEN', 'CUTOFF', 'READY', 'COMPLETED', 'CANCELLED'];
let drops = [];

creatorProfiles.forEach(c => {
    if(c.id === 1003) return; 
    let numDrops = (c.id === 1001 || c.id === 1014) ? 8 : Math.floor(Math.random() * 3) + 2;
    let cMenuItems = menuItems.filter(m => m.rId === c.id);
    
    for(let i=0; i<numDrops; i++) {
        let status = dropStatuses[Math.floor(Math.random() * dropStatuses.length)];
        if(c.id === 1001 && i < 5) status = 'COMPLETED';
        
        let dId = nextDropId++;
        let dropDateStr = 'CURDATE()';
        let cutoffTimeStr = 'NOW()';
        
        if (status === 'COMPLETED' || status === 'CANCELLED') {
             let daysAgo = Math.floor(Math.random() * 30) + 1;
             dropDateStr = `CURDATE() - INTERVAL ${daysAgo} DAY`;
             cutoffTimeStr = `NOW() - INTERVAL ${daysAgo + 1} DAY`;
        } else if (status === 'OPEN' || status === 'ANNOUNCED') {
             let daysAhead = Math.floor(Math.random() * 7) + 1;
             dropDateStr = `CURDATE() + INTERVAL ${daysAhead} DAY`;
             cutoffTimeStr = `NOW() + INTERVAL ${daysAhead - 1} DAY`;
        }
        
        let maxOrders = Math.floor(Math.random() * 30) + 10;
        let currentOrders = 0;
        if (status === 'COMPLETED') currentOrders = maxOrders;
        if (status === 'OPEN') currentOrders = Math.floor(Math.random() * (maxOrders/2));
        if (status === 'CUTOFF' || status === 'READY') currentOrders = maxOrders;

        sql += `INSERT INTO food_drops (drop_id, creator_id, title, description, drop_date, order_cutoff_time, pickup_location, pickup_time, max_orders, current_orders, status, drop_photo_url) VALUES (${dId}, ${c.id}, '${c.name} Weekly Drop ${i+1}', 'Exclusive limited portion menu. Pre-order now!', ${dropDateStr}, ${cutoffTimeStr}, '${c.city} Center', '18:00 - 20:00', ${maxOrders}, ${currentOrders}, '${status}', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg');\n`;
        drops.push({ id: dId, cId: c.id, status: status, dateStr: dropDateStr, currentOrders: currentOrders });
        
        let numDropItems = Math.floor(Math.random() * 3) + 2;
        for(let j=0; j<numDropItems; j++) {
             let mItem = cMenuItems[j % cMenuItems.length];
             sql += `INSERT INTO drop_items (drop_item_id, drop_id, item_id, quantity_available, quantity_ordered) VALUES (${nextDropItemId++}, ${dId}, ${mItem.id}, ${maxOrders * 2}, ${currentOrders * 2});\n`;
        }
    }
});

sql += `\n-- 6. Orders, Items, Payments, Ratings, Notifications\n`;
let nextOrderId = 5001;
let nextOrderItemId = 6001;
let nextPaymentId = 7001;
let nextNotificationId = 8001;
let ratedMap = {};

function createOrder(cId, rId, cName, dId, status, dateStr) {
    let orderId = nextOrderId++;
    let totalAmt = 0;
    let items = [];
    
    let rMenuItems = menuItems.filter(m => m.rId === rId);
    let numItems = Math.floor(Math.random() * 3) + 1;
    
    for(let i=0; i<numItems; i++) {
        let mItem = rMenuItems[i % rMenuItems.length];
        let qty = Math.floor(Math.random() * 3) + 1;
        totalAmt += (mItem.price * qty);
        items.push({ mId: mItem.id, name: mItem.name, qty: qty, price: mItem.price });
    }
    
    let dIdStr = dId ? dId : 'NULL';
    let type = dId ? 'DROP_PREORDER' : 'REGULAR';
    
    // orders.status NOT order_status! No payment_method column in orders!
    sql += `INSERT INTO orders (order_id, user_id, restaurant_id, drop_id, order_type, pickup_time, status, total_amount, order_date) VALUES (${orderId}, ${cId}, ${rId}, ${dIdStr}, '${type}', '19:00', '${status}', ${totalAmt}, ${dateStr});\n`;
    
    items.forEach(it => {
        // order_items.price_each NOT unit_price!
        sql += `INSERT INTO order_items (order_item_id, order_id, item_id, quantity, price_each) VALUES (${nextOrderItemId++}, ${orderId}, ${it.mId}, ${it.qty}, ${it.price});\n`;
    });
    
    let pStatus = status === 'COMPLETED' ? 'COLLECTED' : (status === 'CANCELLED' ? 'CANCELLED' : 'PENDING');
    // payments.method is ENUM('CASH'). No transaction_id, no collected_at!
    sql += `INSERT INTO payments (payment_id, order_id, method, amount, status, payment_date) VALUES (${nextPaymentId++}, ${orderId}, 'CASH', ${totalAmt}, '${pStatus}', ${dateStr});\n`;
    
    if(status === 'COMPLETED' && Math.random() > 0.4) {
        let key = `${cId}-${rId}`;
        if (!ratedMap[key]) {
            ratedMap[key] = true;
            let reviewObj = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
            let rating = reviewObj.r[Math.floor(Math.random() * reviewObj.r.length)];
            let reviewText = reviewObj.t.replace('{dish}', items[0].name);
            sql += `INSERT IGNORE INTO ratings (user_id, restaurant_id, rating_value, review_text) VALUES (${cId}, ${rId}, ${rating}.0, ${escape(reviewText)});\n`;
        }
    }
    
    // Notifications
    if (status === 'COMPLETED' || status === 'READY') {
        sql += `INSERT INTO notifications (notification_id, user_id, type, title, message, reference_type, reference_id, is_read, created_at, event_key) VALUES (${nextNotificationId++}, ${cId}, 'ORDER_READY', 'Your order is ready!', 'Your order at ${escape(cName).replace(/'/g, "")} is ready for pickup.', 'ORDER', ${orderId}, FALSE, ${dateStr}, 'ORDER_READY_${orderId}');\n`;
    } else if (status === 'PLACED') {
        sql += `INSERT INTO notifications (notification_id, user_id, type, title, message, reference_type, reference_id, is_read, created_at, event_key) VALUES (${nextNotificationId++}, ${cId}, 'ORDER_CONFIRMED', 'Order Confirmed', 'Your order at ${escape(cName).replace(/'/g, "")} has been confirmed.', 'ORDER', ${orderId}, FALSE, ${dateStr}, 'ORDER_CONFIRMED_${orderId}');\n`;
    }
}

// Ensure each DROP gets orders if it's completed or open
drops.forEach(d => {
    let crName = creatorProfiles.find(cp => cp.id === d.cId).name;
    
    // Drop Notifications
    if (d.status !== 'DRAFT' && d.status !== 'CANCELLED') {
         let notifyUserId = customerIds[Math.floor(Math.random() * customerIds.length)];
         sql += `INSERT INTO notifications (notification_id, user_id, type, title, message, reference_type, reference_id, is_read, created_at, event_key) VALUES (${nextNotificationId++}, ${notifyUserId}, 'DROP_ANNOUNCED', 'New Drop by ${escape(crName).replace(/'/g, "")}', 'Get your pre-orders in for the upcoming drop!', 'DROP', ${d.id}, FALSE, ${d.dateStr}, 'DROP_ANNOUNCED_${d.id}_${notifyUserId}');\n`;
    }

    if (d.currentOrders > 0) {
        for(let i=0; i<d.currentOrders; i++) {
            let custId = customerIds[Math.floor(Math.random() * customerIds.length)];
            let oStatus = d.status === 'COMPLETED' ? 'COMPLETED' : 'PLACED';
            createOrder(custId, d.cId, crName, d.id, oStatus, `CURDATE() - INTERVAL 2 DAY`);
        }
    }
});

// Update analytics
sql += `\n-- 7. Update Analytics\n`;
sql += `UPDATE restaurants SET total_orders_completed = (SELECT COUNT(*) FROM orders WHERE orders.restaurant_id = restaurants.restaurant_id AND orders.status = 'COMPLETED');\n`;
sql += `UPDATE restaurants SET avg_rating = COALESCE((SELECT AVG(rating_value) FROM ratings WHERE ratings.restaurant_id = restaurants.restaurant_id), 0.0);\n`;
sql += `UPDATE restaurants SET follower_count = (SELECT COUNT(*) FROM creator_follows WHERE creator_follows.creator_id = restaurants.restaurant_id);\n`;

// Reels
sql += `\n-- 8. Reels\n`;
let nextReelId = 10001;
creatorProfiles.forEach(c => {
    if(c.id === 1003) return;
    
    let t1 = reelTitles[Math.floor(Math.random() * reelTitles.length)];
    let t2 = reelTitles[Math.floor(Math.random() * reelTitles.length)];
    if(t1 === t2) t2 = reelTitles[0]; // avoid duplicate
    
    let v1 = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
    let v2 = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

    sql += `INSERT INTO reels (reel_id, restaurant_id, title, media_url) VALUES (${nextReelId++}, ${c.id}, ${escape(t1)}, ${escape(v1)});\n`;
    sql += `INSERT INTO reels (reel_id, restaurant_id, title, media_url) VALUES (${nextReelId++}, ${c.id}, ${escape(t2)}, ${escape(v2)});\n`;
});

// Write to file securely
fs.writeFileSync(outputPath, sql, { encoding: 'utf8' });
console.log('Migration generated successfully at ' + outputPath);

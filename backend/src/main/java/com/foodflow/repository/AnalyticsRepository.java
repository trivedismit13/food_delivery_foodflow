package com.foodflow.repository;

import com.foodflow.model.Restaurant;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@org.springframework.stereotype.Repository
public interface AnalyticsRepository extends Repository<Restaurant, Long> {

    // 1. GET /api/analytics/restaurants/{id}/top-dishes?limit=5
    @Query(value = "SELECT mi.name, SUM(oi.quantity) as total_sold " +
                   "FROM order_items oi " +
                   "JOIN menu_items mi ON oi.item_id = mi.item_id " +
                   "WHERE mi.restaurant_id = :restaurantId " +
                   "GROUP BY mi.item_id, mi.name " +
                   "ORDER BY total_sold DESC " +
                   "LIMIT :limit", nativeQuery = true)
    List<Object[]> findTopDishesByRestaurant(@Param("restaurantId") Long restaurantId, @Param("limit") int limit);

    // 2. GET /api/analytics/users/{id}/recent-orders?days=30
    @Query(value = "SELECT order_id, total_amount, order_date, status " +
                   "FROM orders " +
                   "WHERE user_id = :userId AND order_date >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL :days DAY) " +
                   "ORDER BY order_date DESC", nativeQuery = true)
    List<Object[]> findRecentOrdersByUser(@Param("userId") Long userId, @Param("days") int days);

    // 3. GET /api/analytics/revenue/total?period=LAST_YEAR
    // (Simplifying period logic to just a days parameter for SQL, handled in service)
    @Query(value = "SELECT SUM(total_amount) " +
                   "FROM orders " +
                   "WHERE status = 'DELIVERED' AND order_date >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL :days DAY)", nativeQuery = true)
    Double findTotalRevenue(@Param("days") int days);

    // 4. GET /api/analytics/restaurants/top-rated?limit=10
    @Query(value = "SELECT r.name, AVG(rt.rating_value) as avg_rating " +
                   "FROM restaurants r " +
                   "JOIN ratings rt ON r.restaurant_id = rt.restaurant_id " +
                   "GROUP BY r.restaurant_id, r.name " +
                   "ORDER BY avg_rating DESC " +
                   "LIMIT :limit", nativeQuery = true)
    List<Object[]> findTopRatedRestaurants(@Param("limit") int limit);

    // 5. GET /api/analytics/customers/multi-restaurant
    @Query(value = "SELECT u.name, COUNT(DISTINCT o.restaurant_id) as diff_restaurants " +
                   "FROM users u " +
                   "JOIN orders o ON u.user_id = o.user_id " +
                   "GROUP BY u.user_id, u.name " +
                   "HAVING diff_restaurants > 1 " +
                   "ORDER BY diff_restaurants DESC", nativeQuery = true)
    List<Object[]> findCustomersMultiRestaurant();

    // 6. GET /api/analytics/restaurants/above-average-order-value
    @Query(value = "WITH AvgPerRestaurant AS ( " +
                   "    SELECT restaurant_id, AVG(total_amount) AS avg_value " +
                   "    FROM orders GROUP BY restaurant_id " +
                   "), " +
                   "OverallAvg AS ( " +
                   "    SELECT AVG(total_amount) AS overall FROM orders " +
                   ") " +
                   "SELECT r.name, a.avg_value " +
                   "FROM AvgPerRestaurant a " +
                   "JOIN restaurants r ON a.restaurant_id = r.restaurant_id " +
                   "JOIN OverallAvg o ON 1=1 " +
                   "WHERE a.avg_value > o.overall", nativeQuery = true)
    List<Object[]> findRestaurantsAboveAverageOrderValue();

    // 7. GET /api/analytics/revenue/by-cuisine
    @Query(value = "SELECT r.cuisine, SUM(o.total_amount) as revenue " +
                   "FROM restaurants r " +
                   "JOIN orders o ON r.restaurant_id = o.restaurant_id " +
                   "WHERE o.status = 'DELIVERED' " +
                   "GROUP BY r.cuisine " +
                   "ORDER BY revenue DESC", nativeQuery = true)
    List<Object[]> findRevenueByCuisine();

    // 8. GET /api/analytics/restaurants/revenue-rank-by-city
    @Query(value = "SELECT r.name as name, r.city as city, SUM(o.total_amount) AS revenue, " +
                   "RANK() OVER (PARTITION BY r.city ORDER BY SUM(o.total_amount) DESC) AS rankInCity " +
                   "FROM orders o " +
                   "JOIN restaurants r ON o.restaurant_id = r.restaurant_id " +
                   "WHERE o.status = 'DELIVERED' " +
                   "GROUP BY r.restaurant_id, r.name, r.city " +
                   "ORDER BY r.city, rankInCity", nativeQuery = true)
    List<RevenueRankProjection> findRevenueRankByCity();

    // 9. GET /api/analytics/restaurants/revenue-category
    @Query(value = "WITH MonthlyRevenue AS ( " +
                   "    SELECT restaurant_id, SUM(total_amount) AS monthly_rev " +
                   "    FROM orders " +
                   "    WHERE MONTH(order_date) = MONTH(CURRENT_DATE()) " +
                   "    GROUP BY restaurant_id " +
                   ") " +
                   "SELECT restaurant_id as restaurantId, monthly_rev as monthlyRev, " +
                   "    CASE " +
                   "        WHEN monthly_rev > 300 THEN 'High Revenue' " +
                   "        WHEN monthly_rev BETWEEN 150 AND 300 THEN 'Medium Revenue' " +
                   "        ELSE 'Low Revenue' " +
                   "    END AS revenueCategory " +
                   "FROM MonthlyRevenue", nativeQuery = true)
    List<RevenueCategoryProjection> findRevenueCategory();

    // 10. GET /api/analytics/restaurants/{id}/top-dishes-in-city
    @Query(value = "SELECT mi.name, SUM(oi.quantity) as sold_in_city " +
                   "FROM order_items oi " +
                   "JOIN menu_items mi ON oi.item_id = mi.item_id " +
                   "JOIN restaurants r ON mi.restaurant_id = r.restaurant_id " +
                   "WHERE r.city = (SELECT city FROM restaurants WHERE restaurant_id = :restaurantId) " +
                   "GROUP BY mi.item_id, mi.name " +
                   "ORDER BY sold_in_city DESC " +
                   "LIMIT 5", nativeQuery = true)
    List<Object[]> findTopDishesInCityOfRestaurant(@Param("restaurantId") Long restaurantId);

    // 11. GET /api/analytics/customers/most-loyal?limit=5
    @Query(value = "SELECT u.name, COUNT(o.order_id) as order_count " +
                   "FROM users u " +
                   "JOIN orders o ON u.user_id = o.user_id " +
                   "GROUP BY u.user_id, u.name " +
                   "ORDER BY order_count DESC " +
                   "LIMIT :limit", nativeQuery = true)
    List<Object[]> findMostLoyalCustomers(@Param("limit") int limit);

    // 12. GET /api/analytics/restaurants/top-reels-uploaders
    @Query(value = "SELECT r.name, COUNT(rl.reel_id) as reel_count, SUM(rl.view_count) as total_views " +
                   "FROM restaurants r " +
                   "JOIN reels rl ON r.restaurant_id = rl.restaurant_id " +
                   "GROUP BY r.restaurant_id, r.name " +
                   "ORDER BY reel_count DESC, total_views DESC " +
                   "LIMIT 10", nativeQuery = true)
    List<Object[]> findTopReelsUploaders();

    // 13. GET /api/analytics/restaurants/highest-rated-dish
    // Assumes rating might have been associated with a dish, but since rating is by restaurant, 
    // let's interpret as top rated restaurant's top selling dish, or adjust if dish rating exists. 
    // Wait, the schema doesn't have dish ratings. So "highest-rated-dish" likely means: 
    // Top dish of the highest rated restaurant, or we can use sub-ratings. Let's do top dish of highest rated restaurant.
    @Query(value = "WITH TopRestaurant AS ( " +
                   "    SELECT r.restaurant_id " +
                   "    FROM restaurants r " +
                   "    JOIN ratings rt ON r.restaurant_id = rt.restaurant_id " +
                   "    GROUP BY r.restaurant_id " +
                   "    ORDER BY AVG(rt.rating_value) DESC " +
                   "    LIMIT 1 " +
                   ") " +
                   "SELECT mi.name, SUM(oi.quantity) as total_sold " +
                   "FROM order_items oi " +
                   "JOIN menu_items mi ON oi.item_id = mi.item_id " +
                   "WHERE mi.restaurant_id = (SELECT restaurant_id FROM TopRestaurant) " +
                   "GROUP BY mi.item_id, mi.name " +
                   "ORDER BY total_sold DESC " +
                   "LIMIT 1", nativeQuery = true)
    List<Object[]> findHighestRatedDish();

    // 14. GET /api/analytics/orders/cancelled-with-failed-payment
    @Query(value = "SELECT o.order_id, o.total_amount, p.method " +
                   "FROM orders o " +
                   "JOIN payments p ON o.order_id = p.order_id " +
                   "WHERE o.status = 'CANCELLED' AND p.status = 'FAILED'", nativeQuery = true)
    List<Object[]> findCancelledOrdersWithFailedPayment();

    // 15. Creator performance: which drops sold out fastest
    @Query(value = "SELECT " +
                   "    fd.title, " +
                   "    fd.max_orders, " +
                   "    fd.current_orders, " +
                   "    TIMESTAMPDIFF(HOUR, fd.created_at, fd.updated_at) AS hours_to_sellout, " +
                   "    fd.drop_date " +
                   "FROM food_drops fd " +
                   "WHERE fd.creator_id = :creatorId " +
                   "AND fd.status IN ('CUTOFF', 'COMPLETED') " +
                   "ORDER BY hours_to_sellout ASC " +
                   "LIMIT 5", nativeQuery = true)
    List<Object[]> findFastestSellingDrops(@Param("creatorId") Long creatorId);

    // 16. Most ordered items across all drops for a creator
    @Query(value = "SELECT " +
                   "    mi.name AS dish_name, " +
                   "    SUM(oi.quantity) AS total_ordered, " +
                   "    SUM(oi.quantity * oi.price_each) AS total_revenue, " +
                   "    COUNT(DISTINCT o.order_id) AS order_count " +
                   "FROM orders o " +
                   "JOIN order_items oi ON o.order_id = oi.order_id " +
                   "JOIN menu_items mi ON oi.item_id = mi.item_id " +
                   "WHERE o.restaurant_id = :creatorId " +
                   "AND o.status = 'DELIVERED' " +
                   "GROUP BY mi.item_id, mi.name " +
                   "ORDER BY total_ordered DESC " +
                   "LIMIT 10", nativeQuery = true)
    List<Object[]> findTopItemsForCreator(@Param("creatorId") Long creatorId);

    // 17. Weekly revenue trend for creator
    @Query(value = "SELECT " +
                   "    YEARWEEK(o.order_date) AS week, " +
                   "    COUNT(*) AS total_orders, " +
                   "    SUM(o.total_amount) AS total_revenue, " +
                   "    COUNT(DISTINCT o.user_id) AS unique_customers " +
                   "FROM orders o " +
                   "WHERE o.restaurant_id = :creatorId " +
                   "AND o.status = 'DELIVERED' " +
                   "AND o.order_date >= DATE_SUB(CURDATE(), INTERVAL :weeks WEEK) " +
                   "GROUP BY YEARWEEK(o.order_date) " +
                   "ORDER BY week ASC", nativeQuery = true)
    List<Object[]> findWeeklyRevenueTrend(
        @Param("creatorId") Long creatorId, 
        @Param("weeks") int weeks);

    // 18. Best day of week for a creator
    @Query(value = "SELECT " +
                   "    DAYNAME(fd.drop_date) AS day_of_week, " +
                   "    AVG(fd.current_orders * 100.0 / fd.max_orders) AS avg_fill_rate, " +
                   "    COUNT(*) AS drop_count, " +
                   "    AVG(o_count.order_count) AS avg_orders_per_drop " +
                   "FROM food_drops fd " +
                   "LEFT JOIN ( " +
                   "    SELECT drop_id, COUNT(*) AS order_count " +
                   "    FROM orders " +
                   "    WHERE status != 'CANCELLED' " +
                   "    GROUP BY drop_id " +
                   ") o_count ON fd.drop_id = o_count.drop_id " +
                   "WHERE fd.creator_id = :creatorId " +
                   "AND fd.status = 'COMPLETED' " +
                   "GROUP BY DAYNAME(fd.drop_date), DAYOFWEEK(fd.drop_date) " +
                   "ORDER BY avg_fill_rate DESC", nativeQuery = true)
    List<Object[]> findBestDayOfWeekForCreator(@Param("creatorId") Long creatorId);

    // 19. Repeat customer rate for a creator
    @Query(value = "SELECT " +
                   "    COUNT(DISTINCT CASE WHEN order_count > 1 THEN user_id END) AS repeat_customers, " +
                   "    COUNT(DISTINCT user_id) AS total_customers, " +
                   "    ROUND( " +
                   "        COUNT(DISTINCT CASE WHEN order_count > 1 THEN user_id END) * 100.0 / " +
                   "        COUNT(DISTINCT user_id), " +
                   "        1 " +
                   "    ) AS repeat_rate_percent " +
                   "FROM ( " +
                   "    SELECT user_id, COUNT(*) AS order_count " +
                   "    FROM orders " +
                   "    WHERE restaurant_id = :creatorId " +
                   "    AND status = 'DELIVERED' " +
                   "    GROUP BY user_id " +
                   ") customer_orders", nativeQuery = true)
    Object findRepeatCustomerRate(@Param("creatorId") Long creatorId);

    // 20. Creator summary (for AI insight context)
    @Query(value = "SELECT " +
                   "    r.restaurant_id as creatorId, " +
                   "    r.name as creatorName, " +
                   "    r.total_orders_completed as totalOrders, " +
                   "    r.follower_count as followerCount, " +
                   "    r.avg_rating as avgRating " +
                   "FROM restaurants r " +
                   "WHERE r.restaurant_id = :creatorId", nativeQuery = true)
    Object findCreatorSummary(@Param("creatorId") Long creatorId);
}

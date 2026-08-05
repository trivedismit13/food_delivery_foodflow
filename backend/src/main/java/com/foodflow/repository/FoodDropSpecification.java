package com.foodflow.repository;

import com.foodflow.model.FoodDrop;
import com.foodflow.model.Restaurant;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class FoodDropSpecification {

    public static Specification<FoodDrop> getActiveDropsByFilters(String city, String creatorType, String date, String searchQuery) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Only OPEN drops
            predicates.add(cb.equal(root.get("status"), FoodDrop.DropStatus.OPEN));
            
            // Cutoff time must be in the future
            predicates.add(cb.greaterThan(root.get("orderCutoffTime"), LocalDateTime.now()));

            Join<FoodDrop, Restaurant> restaurantJoin = root.join("creator");

            if (city != null || creatorType != null || searchQuery != null) {
                if (city != null && !city.isEmpty()) {
                    predicates.add(cb.equal(cb.lower(restaurantJoin.get("city")), city.toLowerCase()));
                }

                if (creatorType != null && !creatorType.isEmpty()) {
                    try {
                        Restaurant.CreatorType type = Restaurant.CreatorType.valueOf(creatorType.toUpperCase());
                        predicates.add(cb.equal(restaurantJoin.get("creatorType"), type));
                    } catch (IllegalArgumentException e) {
                        // ignore invalid creator type
                    }
                }

                if (searchQuery != null && !searchQuery.isEmpty()) {
                    String pattern = "%" + searchQuery.toLowerCase() + "%";
                    Predicate titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                    Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                    Predicate creatorMatch = cb.like(cb.lower(restaurantJoin.get("name")), pattern);
                    predicates.add(cb.or(titleMatch, descMatch, creatorMatch));
                }
            }

            if (date != null && !date.isEmpty()) {
                // Assuming date is in format "YYYY-MM-DD"
                try {
                    java.time.LocalDate dropDate = java.time.LocalDate.parse(date);
                    predicates.add(cb.equal(root.get("dropDate"), dropDate));
                } catch (Exception e) {
                    // ignore invalid date
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

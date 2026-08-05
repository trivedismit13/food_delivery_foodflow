package com.foodflow.repository;

import com.foodflow.model.Restaurant;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class RestaurantSpecification {

    public static Specification<Restaurant> getCreatorsByFilters(String city, String cuisine, String creatorType) {
        return (root, query, criteriaBuilder) -> {
            Specification<Restaurant> spec = Specification.where(isAcceptingOrders(true));

            if (StringUtils.hasText(city)) {
                spec = spec.and(hasCity(city));
            }
            if (StringUtils.hasText(cuisine)) {
                spec = spec.and(hasCuisine(cuisine));
            }
            if (StringUtils.hasText(creatorType)) {
                spec = spec.and(hasCreatorType(creatorType));
            }

            return spec.toPredicate(root, query, criteriaBuilder);
        };
    }

    private static Specification<Restaurant> isAcceptingOrders(boolean isAccepting) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("isAcceptingOrders"), isAccepting);
    }

    private static Specification<Restaurant> hasCity(String city) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(criteriaBuilder.lower(root.get("city")), city.toLowerCase());
    }

    private static Specification<Restaurant> hasCuisine(String cuisine) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(criteriaBuilder.lower(root.get("cuisine")), cuisine.toLowerCase());
    }

    private static Specification<Restaurant> hasCreatorType(String type) {
        return (root, query, criteriaBuilder) -> {
            try {
                Restaurant.CreatorType enumType = Restaurant.CreatorType.valueOf(type.toUpperCase().replace(" ", "_"));
                return criteriaBuilder.equal(root.get("creatorType"), enumType);
            } catch (Exception e) {
                return criteriaBuilder.conjunction();
            }
        };
    }
}

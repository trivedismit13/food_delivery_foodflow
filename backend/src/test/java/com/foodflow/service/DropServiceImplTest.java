package com.foodflow.service;

import com.foodflow.dto.request.CreateDropRequest;
import com.foodflow.dto.request.DropItemRequest;
import com.foodflow.dto.response.FoodDropResponse;
import com.foodflow.model.DropItem;
import com.foodflow.model.FoodDrop;
import com.foodflow.model.MenuItem;
import com.foodflow.model.Restaurant;
import com.foodflow.repository.DropItemRepository;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.repository.MenuItemRepository;
import com.foodflow.repository.OrderRepository;
import com.foodflow.repository.RestaurantRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DropServiceImplTest {

    @Mock
    private FoodDropRepository dropRepository;

    @Mock
    private DropItemRepository dropItemRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private MenuItemRepository menuItemRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private DropServiceImpl dropService;

    @Test
    void createDropAllowsItemsFromCreatorRestaurant() {
        Long creatorUserId = 7L;
        Long creatorRestaurantId = 42L;

        Restaurant creator = new Restaurant();
        creator.setRestaurantId(creatorRestaurantId);
        creator.setName("Test Kitchen");

        Restaurant itemRestaurant = new Restaurant();
        itemRestaurant.setRestaurantId(creatorRestaurantId);

        MenuItem existingMenuItem = new MenuItem();
        existingMenuItem.setItemId(10L);
        existingMenuItem.setRestaurant(itemRestaurant);

        when(restaurantRepository.findByOwnerUserId(creatorUserId)).thenReturn(Optional.of(creator));
        when(menuItemRepository.findById(10L)).thenReturn(Optional.of(existingMenuItem));
        when(dropRepository.save(any(FoodDrop.class))).thenAnswer(invocation -> {
            FoodDrop drop = invocation.getArgument(0);
            drop.setDropId(99L);
            return drop;
        });
        when(dropItemRepository.save(any(DropItem.class))).thenAnswer(invocation -> {
            DropItem dropItem = invocation.getArgument(0);
            dropItem.setDropItemId(100L);
            return dropItem;
        });

        CreateDropRequest request = new CreateDropRequest();
        request.setTitle("Weekend Special");
        request.setDescription("A lovely test drop");
        request.setDropDate(LocalDate.now().plusDays(1));
        request.setOrderCutoffTime(LocalDateTime.now().plusHours(2));
        request.setMaxOrders(10);

        DropItemRequest itemRequest = new DropItemRequest();
        itemRequest.setItemId(10L);
        itemRequest.setQuantityAvailable(3);
        itemRequest.setDropPrice(new BigDecimal("12.50"));
        request.setItems(List.of(itemRequest));

        assertDoesNotThrow(() -> {
            FoodDropResponse response = dropService.createDrop(creatorUserId, request);
            assertNotNull(response);
        });
    }
}

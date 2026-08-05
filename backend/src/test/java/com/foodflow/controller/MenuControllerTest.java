package com.foodflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodflow.dto.request.MenuItemRequest;
import com.foodflow.model.MenuItem;
import com.foodflow.model.Restaurant;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.security.JwtUtils;
import com.foodflow.service.MenuItemService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MenuController.class)
@AutoConfigureMockMvc(addFilters = false)
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MenuItemService menuItemService;

    @MockBean
    private RestaurantRepository restaurantRepository;

    @MockBean
    private JwtUtils jwtUtils;

    @Test
    void createMenuItemShouldResolveRestaurantFromRepository() throws Exception {
        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantId(7L);
        when(restaurantRepository.getReferenceById(7L)).thenReturn(restaurant);
        when(menuItemService.createMenuItem(any(MenuItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MenuItemRequest request = new MenuItemRequest();
        request.setName("Test Item");
        request.setDescription("A tasty item");
        request.setPrice(new BigDecimal("123.45"));
        request.setIsVeg(true);
        request.setCategory("Main Course");
        request.setAvailableQty(5);

        mockMvc.perform(post("/api/restaurants/7/menu")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated());

        ArgumentCaptor<MenuItem> captor = ArgumentCaptor.forClass(MenuItem.class);
        verify(menuItemService).createMenuItem(captor.capture());
        assertThat(captor.getValue().getRestaurant()).isNotNull();
        assertThat(captor.getValue().getRestaurant().getRestaurantId()).isEqualTo(7L);
        verify(restaurantRepository).getReferenceById(7L);
    }
}

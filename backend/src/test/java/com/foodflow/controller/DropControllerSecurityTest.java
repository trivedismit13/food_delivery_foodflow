package com.foodflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.security.JwtAuthFilter;
import com.foodflow.service.DropOrderService;
import com.foodflow.service.DropService;
import com.foodflow.service.security.CreatorAuthorizationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@org.springframework.boot.test.context.SpringBootTest
@AutoConfigureMockMvc
public class DropControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DropService dropService;

    @MockBean
    private DropOrderService dropOrderService;

    @MockBean
    private CreatorAuthorizationService authorizationService;

    @MockBean
    private com.foodflow.security.UserDetailsServiceImpl userDetailsService;

    @MockBean
    private com.foodflow.security.JwtUtils jwtUtils;

    @Test
    void testCustomerCanPlaceOrder() throws Exception {
        PlaceDropOrderRequest req = new PlaceDropOrderRequest();
        req.setDropId(1L);
        PlaceDropOrderRequest.ItemRequest ir = new PlaceDropOrderRequest.ItemRequest();
        ir.setItemId(10L);
        ir.setQuantity(1);
        req.setItems(Collections.singletonList(ir));

        com.foodflow.security.UserDetailsImpl customerUser = new com.foodflow.security.UserDetailsImpl(
            1L, "Customer Name", "customer@test.com", "pass", "CUSTOMER"
        );

        mockMvc.perform(post("/api/drops/1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user(customerUser)))
                .andExpect(status().isOk());
    }

    @Test
    void testSellerCannotPlaceOrder() throws Exception {
        PlaceDropOrderRequest req = new PlaceDropOrderRequest();
        req.setDropId(1L);
        PlaceDropOrderRequest.ItemRequest ir = new PlaceDropOrderRequest.ItemRequest();
        ir.setItemId(10L);
        ir.setQuantity(1);
        req.setItems(Collections.singletonList(ir));

        com.foodflow.security.UserDetailsImpl sellerUser = new com.foodflow.security.UserDetailsImpl(
            2L, "Seller Name", "seller@test.com", "pass", "SELLER"
        );

        mockMvc.perform(post("/api/drops/1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user(sellerUser)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminCannotPlaceOrder() throws Exception {
        PlaceDropOrderRequest req = new PlaceDropOrderRequest();
        req.setDropId(1L);
        PlaceDropOrderRequest.ItemRequest ir = new PlaceDropOrderRequest.ItemRequest();
        ir.setItemId(10L);
        ir.setQuantity(1);
        req.setItems(Collections.singletonList(ir));

        com.foodflow.security.UserDetailsImpl adminUser = new com.foodflow.security.UserDetailsImpl(
            3L, "Admin Name", "admin@test.com", "pass", "ADMIN"
        );

        mockMvc.perform(post("/api/drops/1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user(adminUser)))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAnonymousCannotPlaceOrder() throws Exception {
        PlaceDropOrderRequest req = new PlaceDropOrderRequest();
        req.setDropId(1L);

        mockMvc.perform(post("/api/drops/1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
                .with(csrf()))
                .andExpect(status().isForbidden());
    }
}

package com.foodflow.controller;

import com.foodflow.dto.request.UserRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.model.User;
import com.foodflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;



    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@org.springframework.security.core.annotation.AuthenticationPrincipal com.foodflow.security.UserDetailsImpl userDetails) {
        return userService.getUserById(userDetails.getId())
                .map(u -> ResponseEntity.ok(ApiResponse.success(u)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found", 404)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(u -> ResponseEntity.ok(ApiResponse.success(u)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("User not found", 404)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, user)));
    }
}

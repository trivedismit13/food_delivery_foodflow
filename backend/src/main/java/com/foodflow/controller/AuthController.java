package com.foodflow.controller;

import com.foodflow.dto.request.CreatorRegistrationRequest;
import com.foodflow.dto.request.GoogleAuthRequest;
import com.foodflow.dto.request.LoginRequest;
import com.foodflow.dto.request.UserRequest;
import com.foodflow.dto.response.ApiResponse;
import com.foodflow.dto.response.AuthResponse;
import com.foodflow.model.User;
import com.foodflow.service.AuthService;
import com.foodflow.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(authResponse, "Login successful", 200));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@Valid @RequestBody UserRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(authResponse, "Account created successfully", 201));
    }

    @PostMapping("/register-creator")
    public ResponseEntity<ApiResponse<AuthResponse>> registerCreator(@Valid @RequestBody CreatorRegistrationRequest request) {
        AuthResponse authResponse = authService.registerCreator(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(authResponse, "Creator account created successfully", 201));
    }

}

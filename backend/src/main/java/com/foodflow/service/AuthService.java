package com.foodflow.service;

import com.foodflow.dto.request.LoginRequest;
import com.foodflow.dto.request.UserRequest;
import com.foodflow.dto.response.AuthResponse;
import com.foodflow.dto.response.CreatorSummary;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.repository.CreatorVerificationRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.foodflow.model.Restaurant;
import com.foodflow.model.User;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.UserRepository;
import com.foodflow.security.JwtUtils;
import com.foodflow.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CreatorVerificationRepository creatorVerificationRepository;

    @Transactional
    public AuthResponse register(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(com.foodflow.model.Role.CUSTOMER);
        user.setIsActive(true);

        user = userRepository.save(user);

        // Authenticate the user directly
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                UserDetailsImpl.build(user), null, UserDetailsImpl.build(user).getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication);

        return AuthResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(jwt)
                .expiresIn(jwtUtils.getJwtExpirationMs())
                .tokenType("Bearer")
                .creatorProfile(null)
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account is deactivated");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CreatorSummary creatorProfile = null;
        if ("SELLER".equals(userDetails.getRole())) {
            Optional<Restaurant> restaurantOpt = restaurantRepository.findByOwnerUserId(userDetails.getId());
            if (restaurantOpt.isPresent()) {
                Restaurant restaurant = restaurantOpt.get();
                creatorProfile = CreatorSummary.builder()
                        .restaurantId(restaurant.getRestaurantId())
                        .name(restaurant.getName())
                        .creatorType(restaurant.getCreatorType())
                        .verificationLevel(restaurant.getVerificationLevel())
                        .avgRating(restaurant.getAvgRating())
                        .followerCount(restaurant.getFollowerCount())
                        .totalOrdersCompleted(restaurant.getTotalOrdersCompleted())
                        .isAcceptingOrders(restaurant.getIsAcceptingOrders())
                        .build();
            }
        }

        return AuthResponse.builder()
                .userId(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getUsername()) // getUsername returns email in UserDetailsImpl
                .role(userDetails.getRole())
                .token(jwt)
                .expiresIn(jwtUtils.getJwtExpirationMs())
                .tokenType("Bearer")
                .creatorProfile(creatorProfile)
                .build();
    }

    @Transactional
    public AuthResponse registerCreator(com.foodflow.dto.request.CreatorRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(com.foodflow.model.Role.SELLER);
        user.setIsActive(true);
        user.setLastLogin(java.time.LocalDateTime.now());
        
        user = userRepository.save(user);

        Restaurant restaurant = new Restaurant();
        restaurant.setOwner(user);
        restaurant.setName(request.getCreatorName());
        
        restaurant.setCreatorType(Restaurant.CreatorType.HOME_BAKER);

        restaurant.setCity(request.getCity());
        restaurant.setCuisine(request.getWhatDoYouMake());
        restaurant.setBio(request.getBio());
        restaurant.setPickupAddress(request.getPickupLocation());

        restaurant.setVerificationLevel(0);
        restaurant.setIsAcceptingOrders(true);
        
        restaurant = restaurantRepository.save(restaurant);
        
        com.foodflow.model.CreatorVerification verification = new com.foodflow.model.CreatorVerification();
        verification.setCreator(restaurant);
        verification.setCurrentLevel(0);
        creatorVerificationRepository.save(verification);
        
        Authentication auth = new UsernamePasswordAuthenticationToken(UserDetailsImpl.build(user), null, UserDetailsImpl.build(user).getAuthorities());
        String token = jwtUtils.generateJwtToken(auth);
        
        CreatorSummary creatorProfile = CreatorSummary.builder()
                .restaurantId(restaurant.getRestaurantId())
                .name(restaurant.getName())
                .creatorType(restaurant.getCreatorType())
                .verificationLevel(restaurant.getVerificationLevel())
                .avgRating(restaurant.getAvgRating())
                .followerCount(restaurant.getFollowerCount())
                .totalOrdersCompleted(restaurant.getTotalOrdersCompleted())
                .isAcceptingOrders(restaurant.getIsAcceptingOrders())
                .build();
        
        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .expiresIn(jwtUtils.getJwtExpirationMs())
                .tokenType("Bearer")
                .creatorProfile(creatorProfile)
                .build();
        
        return authResponse;
    }
}


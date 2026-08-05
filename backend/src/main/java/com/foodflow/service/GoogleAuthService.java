package com.foodflow.service;

import com.foodflow.dto.response.AuthResponse;
import com.foodflow.model.User;
import com.foodflow.model.Role;
import com.foodflow.repository.UserRepository;
import com.foodflow.security.JwtUtils;
import com.foodflow.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AuthService authService; // to share login response logic if needed or duplicate it here

    @Value("${google.oauth.client-id}")
    private String googleClientId;

    public AuthResponse authenticateWithGoogle(String googleToken) {
        String verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + googleToken;
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(verifyUrl, Map.class);
            Map<String, Object> payload = response.getBody();
            
            if (payload == null || !Boolean.parseBoolean(String.valueOf(payload.get("email_verified")))) {
                throw new RuntimeException("Google email not verified");
            }
            
            String aud = (String) payload.get("aud");
            if (!aud.equals(googleClientId)) {
                throw new RuntimeException("Invalid google client ID");
            }
            
            String email = (String) payload.get("email");
            String name = (String) payload.get("name");
            
            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
            } else {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setRole(Role.CUSTOMER); // Default role
                user.setPassword(""); // No password
                user = userRepository.save(user);
            }
            
            UserDetailsImpl userDetails = UserDetailsImpl.build(user);
            Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            return AuthResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(jwt)
                .expiresIn(86400000)
                .tokenType("Bearer")
                .creatorProfile(null) // Customers don't have creator profiles
                .build();
                
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}

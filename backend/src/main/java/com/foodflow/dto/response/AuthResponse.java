package com.foodflow.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private Long userId;
    private String name;
    private String email;
    private String role;         // "CUSTOMER", "OWNER", "ADMIN"
    private String token;        // JWT
    private long expiresIn;      // milliseconds (86400000 = 24h)
    private String tokenType;    // "Bearer"
    private CreatorSummary creatorProfile;
}

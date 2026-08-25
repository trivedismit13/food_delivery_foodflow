package com.foodflow.dto.response;

import com.foodflow.model.Role;
import com.foodflow.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.foodflow.dto.response.CreatorSummary;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private Boolean isActive;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private CreatorSummary creatorProfile;

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

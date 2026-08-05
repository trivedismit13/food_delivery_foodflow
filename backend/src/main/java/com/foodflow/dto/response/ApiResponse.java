package com.foodflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    
    private boolean success;
    private int status;
    private String message;
    private T data;           // actual payload — null on error
    private Map<String, String> errors;  // field errors — null on success
    private LocalDateTime timestamp;
    private String path;      // request path for debugging
    
    // Static factory methods for clean controller code
    
    public static <T> ApiResponse<T> success(T data, String message, int status) {
        return ApiResponse.<T>builder()
            .success(true)
            .status(status)
            .message(message)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Success", 200);
    }
    
    public static <T> ApiResponse<T> created(T data, String message) {
        return success(data, message, 201);
    }
    
    public static <T> ApiResponse<T> error(String message, int status) {
        return ApiResponse.<T>builder()
            .success(false)
            .status(status)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    public static <T> ApiResponse<T> validationError(
            String message, Map<String, String> errors) {
        return ApiResponse.<T>builder()
            .success(false)
            .status(400)
            .message(message)
            .errors(errors)
            .timestamp(LocalDateTime.now())
            .build();
    }
}

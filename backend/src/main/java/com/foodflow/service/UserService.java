package com.foodflow.service;

import com.foodflow.model.User;
import java.util.Optional;

public interface UserService {
    User registerUser(User user);
    Optional<User> getUserById(Long id);
    User updateUser(Long id, User user);
}

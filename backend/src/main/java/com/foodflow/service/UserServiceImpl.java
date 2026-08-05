package com.foodflow.service;

import com.foodflow.model.User;
import com.foodflow.repository.UserRepository;
import com.foodflow.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(userDetails.getName());
            existingUser.setPhone(userDetails.getPhone());
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}

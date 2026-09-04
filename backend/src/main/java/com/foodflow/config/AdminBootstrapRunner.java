package com.foodflow.config;

import com.foodflow.model.User;
import com.foodflow.model.Role;
import com.foodflow.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    @Value("${admin.bootstrap.enabled:false}")
    private boolean bootstrapEnabled;

    @Value("${admin.bootstrap.email:}")
    private String bootstrapEmail;

    @Value("${admin.bootstrap.password:}")
    private String bootstrapPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminBootstrapRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!bootstrapEnabled) {
            return;
        }

        if (bootstrapEmail == null || bootstrapEmail.trim().isEmpty() ||
            bootstrapPassword == null || bootstrapPassword.trim().isEmpty()) {
            logger.error("Admin bootstrap enabled but email or password is not provided. Skipping bootstrap.");
            return;
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(bootstrapEmail);
        
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (existingUser.getRole() == Role.ADMIN) {
                logger.info("Admin bootstrap account verified/created.");
            } else {
                logger.error("Admin bootstrap email is already in use by a {} account. Bootstrap aborted.", existingUser.getRole());
            }
        } else {
            User admin = new User();
            admin.setEmail(bootstrapEmail);
            admin.setPassword(passwordEncoder.encode(bootstrapPassword));
            admin.setName("Admin");
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            
            userRepository.save(admin);
            logger.info("Admin bootstrap account verified/created.");
        }
    }
}

package com.foodflow;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class TestRunner implements CommandLineRunner {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String hash = "$2a$10$wY.u9H/J9Qn2H2H5uS5n/O9.O3/v.w.y/6.L5/t/v/y.Q.a.w.s.q";
        String[] tests = {"FoodFlow@2024", "password123", "admin", "123456", "12345678", "foodflow", "test", "alice", "bob", "creator", "john", "customer"};
        for (String test : tests) {
            if (passwordEncoder.matches(test, hash)) {
                System.out.println("============================== MATCH FOUND: " + test + " ==============================");
                return;
            }
        }
        System.out.println("============================== NO MATCH FOUND ==============================");
    }
}

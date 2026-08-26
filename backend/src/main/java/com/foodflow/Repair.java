package com.foodflow;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Repair {
    public static void main(String[] args) {
        String jdbcUrl = "jdbc:mysql://localhost:3306/?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "13012005@Sm";

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
            try (PreparedStatement stmt = connection.prepareStatement("DROP DATABASE IF EXISTS food_flow")) {
                stmt.executeUpdate();
                System.out.println("Dropped DB");
            }
            try (PreparedStatement stmt = connection.prepareStatement("CREATE DATABASE food_flow")) {
                stmt.executeUpdate();
                System.out.println("Created DB");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

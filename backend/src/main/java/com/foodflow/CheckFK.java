package com.foodflow;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class CheckFK {
    public static void main(String[] args) {
        String jdbcUrl = "jdbc:mysql://localhost:3306/food_flow?useSSL=false&serverTimezone=UTC";
        String username = "root";
        String password = "13012005@Sm";

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
            String sql = "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'reels' AND COLUMN_NAME = 'drop_id' AND TABLE_SCHEMA = 'food_flow'";
            try (PreparedStatement stmt = connection.prepareStatement(sql);
                 ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    System.out.println("FK NAME: " + rs.getString("CONSTRAINT_NAME"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

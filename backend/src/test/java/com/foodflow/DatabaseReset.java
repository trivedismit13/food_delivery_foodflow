package com.foodflow;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DatabaseReset {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/";
        String user = "root";
        String password = "13012005@Sm";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Dropping database if exists...");
            stmt.executeUpdate("DROP DATABASE IF EXISTS food_flow;");
            
            System.out.println("Creating database food_flow...");
            stmt.executeUpdate("CREATE DATABASE food_flow;");
            
            System.out.println("Database reset successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

package jvbz.boot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseTestRunner implements CommandLineRunner {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("SELECT 1 FROM DUAL");
            System.out.println("Database connection is OK.");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Database connection failed.");
        }
    }
}
package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * The same thing through the PostgreSQL module: the port, the credentials and the
 * wait strategy come with the module, and {@code @Container} runs the lifecycle.
 *
 * <p>The field is static, so one container serves both tests in this class. A non-static
 * field would start a fresh container per test — stronger isolation, several seconds slower.
 */
@Testcontainers
class PostgresModuleTest {

    @Container
    private static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine").withInitScript("init.sql");

    private static Connection connect() throws Exception {
        return DriverManager.getConnection(
                POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
    }

    @Test
    void containerServesTheRealEngine() throws Exception {
        try (Connection connection = connect();
                Statement statement = connection.createStatement();
                ResultSet result = statement.executeQuery("SELECT version()")) {
            assertTrue(result.next());
            // A mock would answer whatever it was told to. This is PostgreSQL answering.
            assertTrue(result.getString(1).startsWith("PostgreSQL 16"));
        }
    }

    @Test
    void initScriptSeededTheSchema() throws Exception {
        try (Connection connection = connect();
                Statement statement = connection.createStatement();
                ResultSet result = statement.executeQuery("SELECT COUNT(*) FROM customer")) {
            assertTrue(result.next());
            assertEquals(3, result.getInt(1));
        }
    }
}

package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * What the container is actually for: assertions that only hold against a real engine.
 *
 * <p>Foreign keys, CHECK constraints and NUMERIC arithmetic are enforced by PostgreSQL,
 * not by the test. An in-memory substitute would either accept the bad writes below or
 * reject them for different reasons than production would.
 */
@Testcontainers
class DataIntegrityTest {

    @Container
    private static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine").withInitScript("init.sql");

    private static Connection connect() throws Exception {
        return DriverManager.getConnection(
                POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
    }

    @Test
    void noInvoiceIsOrphaned() throws Exception {
        try (Connection connection = connect();
                Statement statement = connection.createStatement();
                ResultSet result = statement.executeQuery(
                        """
                        SELECT COUNT(*) FROM invoice i
                        LEFT JOIN customer c ON i.customer_id = c.customer_id
                        WHERE c.customer_id IS NULL
                        """)) {
            assertTrue(result.next());
            assertEquals(0, result.getInt(1));
        }
    }

    @Test
    void foreignKeyRejectsAnUnknownCustomer() throws Exception {
        try (Connection connection = connect();
                Statement statement = connection.createStatement()) {
            SQLException error = assertThrows(
                    SQLException.class,
                    () -> statement.executeUpdate(
                            "INSERT INTO invoice (customer_id, total) VALUES (999, 10.00)"));
            assertEquals("23503", error.getSQLState()); // foreign_key_violation
        }
    }

    @Test
    void checkConstraintRejectsANegativeTotal() throws Exception {
        try (Connection connection = connect();
                Statement statement = connection.createStatement()) {
            SQLException error = assertThrows(
                    SQLException.class,
                    () -> statement.executeUpdate(
                            "INSERT INTO invoice (customer_id, total) VALUES (1, -1.00)"));
            assertEquals("23514", error.getSQLState()); // check_violation
        }
    }

    @Test
    void revenuePerCustomerAggregatesCorrectly() throws Exception {
        try (Connection connection = connect();
                Statement statement = connection.createStatement();
                ResultSet result = statement.executeQuery(
                        """
                        SELECT c.email, COALESCE(SUM(i.total), 0) AS revenue
                        FROM customer c
                        LEFT JOIN invoice i ON i.customer_id = c.customer_id
                        GROUP BY c.email
                        ORDER BY revenue DESC
                        """)) {
            assertTrue(result.next());
            assertEquals("grace@example.com", result.getString("email"));
            assertEquals("42.00", result.getBigDecimal("revenue").toPlainString());

            assertTrue(result.next());
            // 19.99 + 4.50, summed by NUMERIC arithmetic rather than by floating point.
            assertEquals("ada@example.com", result.getString("email"));
            assertEquals("24.49", result.getBigDecimal("revenue").toPlainString());

            assertTrue(result.next());
            // LEFT JOIN, so the customer with no invoices is still a row, at 0.
            assertEquals("linus@example.com", result.getString("email"));
            assertEquals(0, result.getBigDecimal("revenue").signum());
        }
    }
}

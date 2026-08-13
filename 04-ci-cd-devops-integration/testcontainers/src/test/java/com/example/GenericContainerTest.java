package com.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.LogMessageWaitStrategy;

/**
 * The low-level API from the getting-started guide: any image, started by hand.
 *
 * <p>Nothing here knows what PostgreSQL is. The port, the credentials and the readiness
 * signal are all spelled out, which is what {@link PostgresModuleTest} gets for free.
 */
class GenericContainerTest {

    @Test
    void genericContainerRunsAnyImage() throws Exception {
        try (GenericContainer<?> container = new GenericContainer<>("postgres:16-alpine")
                .withExposedPorts(5432)
                .withEnv("POSTGRES_USER", "test")
                .withEnv("POSTGRES_PASSWORD", "test")
                .withEnv("POSTGRES_DB", "test")
                // Postgres logs this line twice: once for the temporary server it uses
                // during initdb, once for the real one. Waiting for the first would
                // connect too early, so withTimes(2) is not optional.
                .waitingFor(new LogMessageWaitStrategy()
                        .withRegEx(".*database system is ready to accept connections.*\\s")
                        .withTimes(2)
                        .withStartupTimeout(Duration.of(60, ChronoUnit.SECONDS)))) {

            container.start();

            // getMappedPort, not 5432: the host port is chosen at random to keep
            // parallel runs and busy laptops from colliding.
            String jdbcUrl = "jdbc:postgresql://%s:%d/test"
                    .formatted(container.getHost(), container.getMappedPort(5432));

            try (Connection connection = DriverManager.getConnection(jdbcUrl, "test", "test");
                    Statement statement = connection.createStatement();
                    ResultSet result = statement.executeQuery("SELECT 1")) {
                assertTrue(result.next());
                assertEquals(1, result.getInt(1));
            }
        }
        // try-with-resources stops and removes the container. Even if the JVM is killed
        // first, the Ryuk sidecar reaps it, so nothing is left behind.
    }
}

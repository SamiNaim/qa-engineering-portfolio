-- Run by PostgreSQLContainer.withInitScript() before the first test touches the database.
-- Every test class gets this schema in a container of its own, freshly created.
CREATE TABLE customer (
    customer_id SERIAL PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE,
    country     TEXT NOT NULL
);

CREATE TABLE invoice (
    invoice_id  SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer (customer_id),
    total       NUMERIC(10, 2) NOT NULL CHECK (total >= 0)
);

INSERT INTO customer (email, country) VALUES
    ('ada@example.com',   'UK'),
    ('grace@example.com', 'US'),
    ('linus@example.com', 'FI');

INSERT INTO invoice (customer_id, total) VALUES
    (1, 19.99),
    (1,  4.50),
    (2, 42.00);

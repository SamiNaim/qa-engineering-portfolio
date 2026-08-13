from testcontainers.community.postgres import PostgresContainer
import psycopg2

def test_postgres_container_starts_and_accepts_queries():
    with PostgresContainer("postgres:16") as postgres:
        conn = psycopg2.connect(
            host=postgres.get_container_host_ip(),
            port=postgres.get_exposed_port(5432),
            user=postgres.username,
            password=postgres.password,
            dbname=postgres.dbname,
        )
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        assert cur.fetchone()[0] == 1
        conn.close()
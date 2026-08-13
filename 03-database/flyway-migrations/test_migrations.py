import subprocess
from testcontainers.community.postgres import PostgresContainer
import psycopg2

def test_migrations_apply_cleanly_to_fresh_db():
    with PostgresContainer("postgres:16") as postgres:
        port = postgres.get_exposed_port(5432)
        subprocess.run([
            "docker", "run", "--rm",
            "-v", f"{__file__.rsplit('/',1)[0]}/sql:/flyway/sql",
            "flyway/flyway",
            f"-url=jdbc:postgresql://host.docker.internal:{port}/{postgres.dbname}",
            f"-user={postgres.username}",
            f"-password={postgres.password}",
            "migrate"
        ], check=True)

        conn = psycopg2.connect(
            host=postgres.get_container_host_ip(), port=port,
            user=postgres.username, password=postgres.password,
            dbname=postgres.dbname,
        )
        cur = conn.cursor()
        cur.execute("""
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'customer';
        """)
        columns = {row[0] for row in cur.fetchall()}
        assert {"customer_id", "email", "created_at"}.issubset(columns)
        conn.close()
import pytest
from pathlib import Path
from testcontainers.community.postgres import PostgresContainer
import psycopg2

SEED_SQL = Path(__file__).parent / "chinook.sql"


@pytest.fixture(scope="session")
def postgres_container():
    """Owns the container lifecycle. Nothing else starts one."""
    with PostgresContainer("postgres:16") as postgres:
        yield postgres


@pytest.fixture(scope="session")
def seeded_postgres(postgres_container):
    """Yields a live psycopg2 connection to the seeded database."""
    conn = psycopg2.connect(
        host=postgres_container.get_container_host_ip(),
        port=postgres_container.get_exposed_port(5432),
        user=postgres_container.username,
        password=postgres_container.password,
        dbname=postgres_container.dbname,
    )
    with open(SEED_SQL) as f:
        with conn.cursor() as cur:
            cur.execute(f.read())
    conn.commit()
    yield conn
    conn.close()


@pytest.fixture(scope="session")
def seeded_postgres_url(postgres_container, seeded_postgres):
    """SQLAlchemy URL for the same container, for tools that take a
    connection string rather than a DBAPI connection (e.g. Great Expectations).

    Depends on seeded_postgres so the seed is guaranteed to have run first.
    """
    return postgres_container.get_connection_url()


@pytest.fixture(scope="session")
def seeded_postgres_params(postgres_container, seeded_postgres):
    """Discrete connection fields for the same container, for tools that take
    host/port/username/password rather than a URL (e.g. Soda Core).

    Depends on seeded_postgres so the seed is guaranteed to have run first.
    """
    return {
        "host": postgres_container.get_container_host_ip(),
        "port": postgres_container.get_exposed_port(5432),
        "username": postgres_container.username,
        "password": postgres_container.password,
        "database": postgres_container.dbname,
    }

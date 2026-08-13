from pathlib import Path

from soda.scan import Scan

CHECKS_YML = Path(__file__).parent / "checks.yml"
DATA_SOURCE = "chinook"


def build_configuration_yaml(host, port, username, password, database, schema="public"):
    """Render the Soda data source config for the given database.

    The connection details are parameters rather than a checked-in
    configuration.yml because the database is a Testcontainers instance on a
    random host port.
    """
    return f"""
data_source {DATA_SOURCE}:
  type: postgres
  host: {host}
  port: "{port}"
  username: {username}
  password: {password}
  database: {database}
  schema: {schema}
"""


def run_customer_scan(**connection):
    """Run checks.yml against the given database and return the finished scan.

    Checks live in YAML so they stay readable to non-Python readers; only the
    connection is built in code.
    """
    scan = Scan()
    scan.set_scan_definition_name("customer_integrity")
    scan.set_data_source_name(DATA_SOURCE)
    scan.add_configuration_yaml_str(build_configuration_yaml(**connection))
    scan.add_sodacl_yaml_file(str(CHECKS_YML))
    scan.execute()
    return scan

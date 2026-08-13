import sys
from pathlib import Path

# This directory has a hyphen in its name, so it cannot be imported as a package.
sys.path.insert(0, str(Path(__file__).parent))
from run_scan import run_customer_scan


def test_customer_checks_pass_against_seeded_container(seeded_postgres_params):
    scan = run_customer_scan(**seeded_postgres_params)
    scan.assert_no_error_logs()
    scan.assert_no_checks_fail()

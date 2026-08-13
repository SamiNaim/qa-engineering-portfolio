import sys
from pathlib import Path

import great_expectations as gx

sys.path.insert(0, str(Path(__file__).parent))
from build_suite import build_customer_suite


def test_customer_suite_passes_against_seeded_container(seeded_postgres_url):
    context = gx.get_context(context_root_dir=str(Path(__file__).parent / "gx"))
    validator = build_customer_suite(context, seeded_postgres_url)
    result = validator.validate()
    assert result.success, result

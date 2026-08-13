import great_expectations as gx


def build_customer_suite(context, connection_string):
    """Build the customer integrity suite against the given database.

    The connection string is a parameter rather than a constant because the
    database is a Testcontainers instance on a random host port -- there is
    nothing stable to hardcode.
    """
    datasource = context.sources.add_or_update_postgres(
        "chinook_datasource",
        connection_string=connection_string,
    )
    asset = datasource.add_table_asset(name="customer", table_name="customer")
    batch_request = asset.build_batch_request()

    suite = context.add_or_update_expectation_suite("customer_integrity_suite")
    validator = context.get_validator(batch_request=batch_request, expectation_suite=suite)

    # Map directly to your Phase-2 integrity questions:
    validator.expect_column_values_to_not_be_null("email")
    validator.expect_column_values_to_be_unique("email")
    validator.expect_column_values_to_not_be_null("customer_id")
    validator.expect_column_values_to_be_unique("customer_id")

    validator.save_expectation_suite(discard_failed_expectations=False)
    return validator


if __name__ == "__main__":
    import sys

    context = gx.get_context()
    build_customer_suite(context, sys.argv[1])

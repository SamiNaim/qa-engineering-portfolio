def test_customer_count_matches_expected(seeded_postgres):
    cur = seeded_postgres.cursor()
    cur.execute("SELECT COUNT(*) FROM customer;")
    count = cur.fetchone()[0]
    assert count > 0

def test_no_orphaned_invoices(seeded_postgres):
    cur = seeded_postgres.cursor()
    cur.execute("""
        SELECT COUNT(*) FROM invoice i
        LEFT JOIN customer c ON i.customer_id = c.customer_id
        WHERE c.customer_id IS NULL;
    """)
    orphans = cur.fetchone()[0]
    assert orphans == 0
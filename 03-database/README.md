<div align="center">

# Database Testing

**Database testing with Testcontainers, Flyway, Great Expectations and Soda Core.**

</div>

---

## Tools

| Tool | Best for | Pros | Cons |
|---|---|---|---|
| Testcontainers | Real DB per test run, no mocks | fully isolated, nothing to spin up prior, same locally and in CI | slower than mocks, requires Docker |
| Flyway | Versioned, auditable schema changes | version-controlled artifacts, fresh Testcontainers, rollback/history tracking, plain SQL | heavyweight for a solo prototype, rollback support is paid (alt. Luquibase) |
| Great Expectations | Deep, expressive data-quality suites | supoprts statistical expectations, reusable artifacts, strong ecosystem integration | onboarding overhead, Python-only, many steps for simple checks |
| Soda Core | Quick, readable data-quality gates | fast to write and read, language-agnostic, easy to add to existing pipeline | lighter version of Great Expectations, minimal reporting |

## Sources

**SQL Fluency**
- https://sqlbolt.com
- https://www.youtube.com/watch?v=HXV3zeQKqGY

**Testing Tools**
- https://testcontainers.com/
- https://docs.greatexpectations.io/
- https://docs.soda.io/

**Databases**
- https://github.com/lerocha/chinook-database
# Multi-stage build. Stage 1 has pip and the wheel toolchain, stage 2 does not:
# only the installed packages are carried across, so no build tooling ships to production.
FROM python:3.12-slim AS builder

WORKDIR /usr/src/app

# requirements.txt is copied before the source so this layer is reused
# on every build where dependencies did not change.
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


FROM python:3.12-slim

WORKDIR /usr/src/app

COPY --from=builder /install /usr/local
COPY . .

# Run as a non-root user: a process that does not need root should not have it.
RUN useradd --create-home --uid 10001 appuser \
    && chown -R appuser:appuser /usr/src/app
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')"

CMD ["python", "./app.py"]

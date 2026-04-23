# Stage 1: Builder
FROM python:3.12-slim AS builder
WORKDIR /build

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Production
FROM python:3.12-slim
WORKDIR /app

# Install procps to get the 'pgrep' command
RUN apt-get update && apt-get install -y --no-install-recommends procps && rm -rf /var/lib/apt/lists/*

# Setup user
RUN groupadd -r appgroup && useradd -r -g appgroup -m appuser

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/usr/local/bin:$PATH"

# Copy only necessary files from builder and local source
COPY --from=builder /install /usr/local
COPY --chown=appuser:appgroup . .

USER appuser

# Healthcheck: verify worker process status is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD pgrep -f "python3 worker.py" || exit 1

CMD ["python3", "worker.py"]
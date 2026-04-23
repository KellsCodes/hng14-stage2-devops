# Stage 1: Build dependencies
FROM python:3.12-slim AS builder

WORKDIR /build
RUN apt-get update && apt-get install -y  --no-install-recommends gcc python3-dev

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Final Runtime
FROM python:3.12-slim
WORKDIR /app

# Install curl ONLY for the healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Setup user
RUN groupadd -r appgroup && useradd -r -g appgroup -m appuser

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/usr/local/bin:$PATH"
    
# Copy only necessary files from builder and local source
COPY --from=builder /install /usr/local
COPY --chown=appuser:appgroup . .


USER appuser
EXPOSE 8000

# Healthcheck: verify FASTAPI is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
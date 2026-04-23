# Stage 1: Build
FROM node:25-alpine3.20 AS builder

WORKDIR /build

COPY package*.json ./

RUN npm ci --legacy-peer-deps

# Stage 2: Production
FROM node:25-alpine3.20

WORKDIR /app

# Add curl for healthcheck
RUN apk add --no-cache curl

# Setup user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy node_modules directly to the app folder
COPY --from=builder /build/node_modules ./node_modules
COPY --chown=appuser:appgroup ./api .

USER appuser
EXPOSE 3000

# Healthcheck: verify is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "app.js"]

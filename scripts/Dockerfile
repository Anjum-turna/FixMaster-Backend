# Multi-stage Dockerfile for Fix Master Backend

FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Stage 2: Runtime (production-optimized)
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files from builder
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built artifacts from builder
COPY --from=builder /app/dist/ ./dist/

# Copy .env (or use ARG/ENV for secrets in production)
COPY .env ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 5000

# Health check (optional: ping the health endpoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/', (res) => { if (res.statusCode !== 200) process.exit(1) })"

# Start the application
CMD ["npm", "start"]
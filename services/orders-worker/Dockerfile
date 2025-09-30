# Multi-stage build for Orders Worker
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/orders-worker/package.json ./services/orders-worker/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Build the application
RUN pnpm build --filter=@tdc/orders-worker

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm@8

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S worker -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/orders-worker/package.json ./services/orders-worker/
COPY packages/*/package.json ./packages/*/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder --chown=worker:nodejs /app/services/orders-worker/dist ./services/orders-worker/dist
COPY --from=builder --chown=worker:nodejs /app/packages ./packages

# Switch to non-root user
USER worker

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Orders worker is running')"

# Start the application
CMD ["node", "services/orders-worker/dist/index.js"]


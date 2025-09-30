# Multi-stage build for API Gateway
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Build the application
RUN pnpm build --filter=@tdc/api-gateway

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm@8

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages/*/package.json ./packages/*/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages

# Copy necessary files
COPY --chown=nextjs:nodejs apps/api-gateway/next.config.js ./apps/api-gateway/
COPY --chown=nextjs:nodejs apps/api-gateway/public ./apps/api-gateway/public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "apps/api-gateway/dist/index.js"]


# Multi-stage build for Web Admin
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web-admin/package.json ./apps/web-admin/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Build the application
RUN pnpm build --filter=@tdc/web-admin

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
COPY apps/web-admin/package.json ./apps/web-admin/
COPY packages/*/package.json ./packages/*/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-admin/.next ./apps/web-admin/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web-admin/public ./apps/web-admin/public
COPY --from=builder --chown=nextjs:nodejs /app/packages ./packages

# Copy necessary files
COPY --chown=nextjs:nodejs apps/web-admin/next.config.js ./apps/web-admin/
COPY --chown=nextjs:nodejs apps/web-admin/package.json ./apps/web-admin/

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["pnpm", "start", "--filter=@tdc/web-admin"]


# Use official Node.js image as build environment
FROM node:20-alpine AS builder

WORKDIR /app

# Install Yarn and security updates
RUN corepack enable && \
    apk add --no-cache dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001


# Copy package files first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies with cache mount for better performance
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile && \
    yarn cache clean

# Copy source code
COPY --chown=nextjs:nodejs . .

# Build the Next.js app
RUN yarn build

# Production image - use distroless for smaller size
FROM node:20-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3030

# Copy package files
COPY --chown=nextjs:nodejs package.json yarn.lock ./

# Install only production dependencies
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --production && \
    yarn cache clean

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js

# Create non-root user and set permissions
USER nextjs

EXPOSE 3030

# Use dumb-init to handle signals properly
CMD ["dumb-init", "yarn", "start"]

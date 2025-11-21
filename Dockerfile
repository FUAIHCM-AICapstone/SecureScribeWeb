# Use official Node.js image as build environment
FROM node:20-alpine AS base

WORKDIR /app

# Install Yarn and security updates
RUN corepack enable && \
    apk add --no-cache dumb-init gettext && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Install dependencies
FROM base AS deps
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Development image
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
CMD ["yarn", "run", "dev"]

# Build the Next.js app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image - use distroless for smaller size
FROM base AS runner

WORKDIR /app

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

# Copy entrypoint script
COPY --chown=nextjs:nodejs entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Create non-root user and set permissions
USER nextjs

EXPOSE 3030

# Use entrypoint to generate config and start app
ENTRYPOINT ["/entrypoint.sh"]
CMD ["dumb-init", "yarn", "start"]

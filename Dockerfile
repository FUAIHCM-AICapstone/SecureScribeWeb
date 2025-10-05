# Use official Node.js image as build environment
FROM node:20-alpine AS builder

WORKDIR /app

# Install Yarn
RUN corepack enable

# Copy package.json and yarn.lock (if available)
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN yarn build

# Production image, copy only necessary files
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=https://securescribe.wc504.io.vn/api

# Install Yarn
RUN corepack enable

# Copy package.json and yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js /app/package.json ./
ENV PORT=3030
EXPOSE 3030

CMD ["yarn", "start"]

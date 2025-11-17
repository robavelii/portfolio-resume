# Base stage
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder stage
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci --include=dev
RUN npx prisma generate
COPY . .
RUN npm run build

# Development stage
FROM base AS development
WORKDIR /app
ENV NODE_ENV=development

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

COPY . .
COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 3000
CMD ["./start.sh"]

# Production stage
FROM base AS production
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy dependencies and Prisma
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy build artifacts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY healthcheck.js ./
COPY start.sh ./
RUN chmod +x start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

EXPOSE 3000
CMD ["./start.sh"]
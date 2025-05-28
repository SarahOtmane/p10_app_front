# Frontend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./

# Remove lock file and install fresh
RUN rm -f package-lock.json && npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Development/Production image
FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files and install for development
COPY package*.json ./
RUN rm -f package-lock.json && npm install

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3001

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use development command for mounted volumes
CMD ["npm", "run", "dev"]
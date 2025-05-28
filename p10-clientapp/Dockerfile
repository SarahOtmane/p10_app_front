# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies globally to avoid permission issues
RUN npm install -g next

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development

EXPOSE 3001

# Use global next binary
CMD ["next", "dev", "-p", "3001"]
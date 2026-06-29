# ==========================================
# Stage 1: Build both Frontend and Backend
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package management configurations
COPY package*.json ./

# Install all development dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the frontend assets via Vite and production elements
RUN npm run build

# ==========================================
# Stage 2: Run the Production Application
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

# Copy package configurations to install only production modules
COPY package*.json ./
RUN npm ci --omit=dev

# Install tsx globally in the runner layer to execute server.ts directly
RUN npm install -g tsx

# Copy the built assets and logic files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/.env* ./

# Expose the application port
EXPOSE 3000

# Execute the application server
CMD ["tsx", "server.ts"]
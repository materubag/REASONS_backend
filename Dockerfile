# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies to compile TypeScript)
RUN npm ci

# Copy source code and configuration files
COPY . .

# Build the TypeScript application
RUN npm run build

# Remove development dependencies to keep the image lightweight
RUN npm prune --production

# Stage 2: Run the application
FROM node:20-alpine AS runner

WORKDIR /app

# Copy compiled files and production dependencies from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create default uploads directory
RUN mkdir -p uploads

# Expose port (Render automatically configures and overrides this via PORT environment variable)
EXPOSE 3000

ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]

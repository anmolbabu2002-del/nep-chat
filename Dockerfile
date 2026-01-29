# Chat App Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for SQLite and other native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    postgresql-client

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S chatapp -u 1001

# Change ownership of app directory
RUN chown -R chatapp:nodejs /app
USER chatapp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "
        const http = require('http');
        const options = { hostname: 'localhost', port: 3000, path: '/health', method: 'GET' };
        const req = http.request(options, (res) => {
            if (res.statusCode === 200) process.exit(0);
            else process.exit(1);
        });
        req.on('error', () => process.exit(1));
        req.end();
    "

# Start the application
CMD ["npm", "start"]

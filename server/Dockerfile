FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source files
COPY . .

# Expose port (Railway provides PORT env variable, defaulting to 3000 if not set)
EXPOSE 3000

# Start server
CMD ["npm", "start"]

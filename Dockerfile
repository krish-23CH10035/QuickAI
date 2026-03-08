FROM node:18-alpine

WORKDIR /app

# Copy the server package files
COPY server/package*.json ./server/

# Install dependencies in the server directory
RUN cd server && npm install

# Copy all the backend code
COPY server ./server

# Set working directory to the server folder
WORKDIR /app/server

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]

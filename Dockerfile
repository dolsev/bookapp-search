# Base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]

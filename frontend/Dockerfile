# Use node 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend source files
COPY frontend/ .

# Expose port 3000
EXPOSE 3000

# Command to run development server
CMD ["npm", "run", "dev"]
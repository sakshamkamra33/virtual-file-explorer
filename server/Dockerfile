FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Generate the massive binary data file if it doesn't exist
RUN npm run generate

# Expose the API port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]

# Use the official Node.js 14 image as the base image
FROM node:21-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Expose the port on which the Node.js application will run
EXPOSE 8080

# Start the Node.js application
CMD [ "npm", "start" ]

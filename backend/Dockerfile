# Use an official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Build the TypeScript code (only if you're using TypeScript)
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Command to run your app
CMD ["npm", "start"]

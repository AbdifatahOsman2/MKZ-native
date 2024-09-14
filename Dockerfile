# Base image for Node.js (updated to Node 18)
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Install expo-cli and @expo/ngrok globally
RUN npm install -g expo-cli @expo/ngrok

# Copy the rest of the project files
COPY . .

# Expose the ports Expo uses
EXPOSE 19000 19001 19002

# Set environment variable for Expo DevTools
ENV EXPO_DEVTOOLS_LISTENING_PORT=19001

# Copy the metro.config.js into the container to ensure tunneling is preconfigured
COPY metro.config.js ./metro.config.js

# Start the Expo project with --tunnel
CMD ["npx", "expo", "start", "--tunnel"]

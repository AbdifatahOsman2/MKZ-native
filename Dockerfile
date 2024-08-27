# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install -y

# Copy the rest of the project files
COPY . .

# Exclude the .env file from the Docker image
RUN rm -f .env

# Expose the port the app runs on
EXPOSE 19000

# Start the app
CMD ["npx", "expo", "start", "--tunnel", "-y"]

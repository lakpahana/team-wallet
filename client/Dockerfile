# Use an official Node.js runtime as the base image
FROM node:20 as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use an official Nginx runtime as the base image
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port Nginx will serve on
EXPOSE 80

# No CMD is needed as Nginx will start automatically

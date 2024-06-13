# Use an official Node.js runtime as the base image
FROM node:20 

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Nginx will serve on
EXPOSE 3000

CMD [ "npm", "start" ]

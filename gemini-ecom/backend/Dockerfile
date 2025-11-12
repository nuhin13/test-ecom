# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# List files before build
RUN ls -la

# Build TypeScript code
RUN npm run build

# List files after build
RUN ls -la

# Your app binds to port 5001 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 5001

# Define the command to run your app
CMD [ "npm", "start" ]

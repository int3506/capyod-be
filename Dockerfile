# Use the official Node.js image.
FROM node:14

# Set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of your application files.
COPY . .

# Build the application.
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Command to run your app
CMD ["npm", "run", "start:prod"]

# Dockerfile for the backend

# Use the official Node.js image as a base
FROM node:22

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

# Generate Prisma Client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Command to run Prisma migrations, seed the database, and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && npm run start:prod"]
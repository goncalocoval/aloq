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

# Compile TypeScript
RUN npm run build

# List the contents of the dist folder for debugging
RUN echo "Contents of dist folder:" && ls -la dist

# Expose the port the app runs on
EXPOSE 3000

# Run Prisma migrations and then start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]

# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY yarn*.lock ./

# Install the application dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

RUN npx prisma generate

# Build the NestJS application
RUN yarn run build

# Expose the application port
EXPOSE 3006

# Command to run the application
CMD ["node", "dist/src/main"]
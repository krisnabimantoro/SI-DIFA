# Use the official Node.js image as the base image
FROM node:20

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the dependency-related files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN pnpm build

# Expose the port the app runs on
EXPOSE 3006

# Start the application
CMD ["node", "dist/main"]

# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install application dependencies using Yarn
RUN yarn install

# Copy the entire application to the container
COPY . .

# Expose the port your NestJS application runs on
EXPOSE 3000

RUN npx prisma generate
# RUN npx prisma migrate dev

# Command to start your application
CMD ["yarn", "run", "start:migrate:dev"] 
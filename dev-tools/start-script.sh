#!/bin/bash

### This script is used to take down the development server, setting it up with the proper database and seed data so that it can be used for development. ###


# Stop and remove containers
docker-compose down

# Build and start containers
docker-compose up --build -d

# Download the wait-for-it.sh script
curl -O https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
chmod +x wait-for-it.sh

# Wait for the backend container to be ready
./wait-for-it.sh backend:8080 --timeout=10 -- echo "Backend is up and running!"

# Wait for the database container to be ready
./wait-for-it.sh db:3306 --timeout=10 -- echo "Database is up and running!"

# Extra sleep command to ensure database is fully initialized
sleep 5

# Run database migrations
docker-compose exec -T backend npx prisma migrate dev

# Seed the database
docker-compose exec -T backend npm run seed

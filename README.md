# Backend

## Docker Installation

Install docker: https://www.docker.com/products/docker-desktop/

## Starting and Stopping

### Prerequisites

- Create a `.env` file inside `app` directory with variables matching the `.env.example` file.

- Run the `npm install` & `npm run build` commands inside the `app` directory before building the docker containers.

- For the `production environment`, the development environment docker container must be built before the production environment container. This is necessary because the production container relies on the compiled output from the development container.

### Build the docker containers in development environment

    $ docker-compose up --build

### Build the docker containers in production environment

    $ docker-compose -f docker-compose.prod.yml up -d

### Stop all docker containers

    $ docker-compose down

### Database migration

After building the container, run the following command to migrate the database:

    $ docker-compose exec backend npx prisma migrate deploy

### Database seeding **(OPTIONAL)**

After migrating the database, run the following command to seed the database:

    $ docker-compose exec backend npm run seed

## Add Packages

    $ cd ./app/
    $ npm install <package name>

## Testing

    $ cd ./app/
    $ npm test

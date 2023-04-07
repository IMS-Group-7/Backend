# Backend

## Docker Installation

Install docker: https://www.docker.com/products/docker-desktop/

## Starting and Stopping

### Prerequisites

- Create a `.env` file inside `app` directory with variables matching the `.env.example` file.

- Run the `npm install` command inside the `app` directory before building the docker containers.

- For the `production environment`, the development environment docker container must be built before the production environment container. This is necessary because the production container relies on the compiled output from the development container.

### Build the docker containers in development environment

    $ docker-compose up --build

### Build the docker containers in production environment

    $ docker-compose -f docker-compose.prod.yml up

### Stop all docker containers

    $ docker-compose down

## Add Packages

    $ cd ./app/
    $ npm install <package name>

## Testing

    $ cd ./app/
    $ npm test

### Docker

# Installation

Install docker: https://www.docker.com/products/docker-desktop/

# Starting and Stopping

### Prerequisites

create a `.env` file inside `app` directory with variables matching the `.env.example` file.

### Build the docker containers in development environment

    $ docker-compose up --build

### Build the docker containers in production environment

    $ docker-compose -f docker-compose.prod.yml up

### Stop the docker containers

    $ docker-compose down

# Add Packages

    $ cd ./app/
    $ npm install <package name>

# Testing

    $ cd ./app/
    $ npm test

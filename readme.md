# Quick Deployment Guide

## Automated Deployment with Docker

Ensure Docker is installed on your system.

1. **Clone the repository** and **navigate** to the project directory.
2. Run `docker-compose up` to build and start all containers.

## Manual Deployment

Install Node.js, npm/yarn, and set up a Postgres database.

1. **Backend**: Install dependencies with `npm install` and start with `npm start` inside the backend directory.
2. **Frontend**: Install dependencies with `npm install` and start with `npm start` inside the frontend directory.
3. **Database**: Initialize the postgres database and configure the backend to connect to it.

## Access Points

- **Swagger UI**: [http://localhost:4000/api-docs#/](http://localhost:4000/api-docs#/)
- **Backend API**: [http://localhost:4000/](http://localhost:4000/)
- **Frontend App**: [http://localhost:3000/](http://localhost:3000/)

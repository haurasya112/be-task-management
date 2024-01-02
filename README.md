# Task Management System - Backend

This repository contains the backend implementation of a Task Management System developed for the BLP Beauty Selection Backend Engineer Internship.

The API documentation can be accessed at the following link: 
[DOCUMENTATION API](https://documenter.getpostman.com/view/23702805/2s9YsDmFon)

## Features

- **User Authentication:** Secure user registration and login functionality.
- **Token-based Authentication:** Uses JSON Web Tokens (JWT) for secure authentication.
- **Task Management:** Allows users to create, update, and delete tasks.
- **File Upload:** Supports attachment of files/images to tasks.

## Technologies Used

- **Programming Language:** Node.js
- **Web Framework:** Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JSON Web Tokens (JWT)
- **File Upload:** AWS S3 (for storing file attachments)
- **Other Libraries:** bcrypt, dotenv, cors, cookie-parser, multer, and more.

## Project Structure

- **Controllers:** Handles business logic and interacts with models.
- **Models:** Defines the database schema using Sequelize ORM.
- **Routes:** Defines API routes and integrates with controllers.
- **Middlewares:** Custom middleware functions, e.g., authentication.
- **Config:** Configuration files, e.g., database connection setup.
- **Public:** Placeholder for static files (images in this case).
- **Tests:** Unit and integration tests (if applicable).

## Getting Started

1. Clone the repository: `git clone https://github.com/haurasya112/be-task-management.git`
2. Install dependencies: `npm install`
3. Configure environment variables: Create a `.env` file based on the provided `.env.example`.
4. Set up the database: Create a MySQL database and update the connection details in `.env`.
5. Run the application: `npm start`

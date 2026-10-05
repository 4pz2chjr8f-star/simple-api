# Simple API

A simple REST API built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**.

The project is intended as a learning project for understanding how a basic API is structured.

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Docker
- Docker Compose
- Postman

## Project Structure

```text
simple-api/
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── pagination.js
│   │   └── requestLogger.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   └── server.js
├── .env
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

## Requirements

Make sure you have installed:

- Node.js
- Docker Desktop
- npm

## Installation

Clone the project and install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/simple_api
```

## Running the Project

Start the application in development mode:

```bash
npm run dev
```

This command:

1. Starts MongoDB using Docker Compose.
2. Starts the Node.js server using Nodemon.

The API will be available at:

```text
http://localhost:3000
```

MongoDB runs on:

```text
localhost:27017
```

## Stopping the Project

Stop the Node.js server with:

```text
Ctrl + C
```

MongoDB runs in a Docker container, so it can be stopped separately with:

```bash
npm run db:down
```

To start MongoDB again:

```bash
npm run db:up
```

## API

The user API is available under:

```text
/api/users
```

### Create a User

```http
POST /api/users
```

Example request body:

```json
{
  "name": "John",
  "email": "john@example.com"
}
```

Successful response:

```json
{
  "data": {
    "_id": "...",
    "name": "John",
    "email": "john@example.com"
  }
}
```

### Get Users

```http
GET /api/users
```

The endpoint supports pagination.

Example:

```http
GET /api/users?page=1&limit=10
```

Example response:

```json
{
  "data": [
    {
      "_id": "...",
      "name": "John",
      "email": "john@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

Pagination rules:

- Default page: `1`
- Default limit: `10`
- Minimum page: `1`
- Minimum limit: `1`
- Maximum limit: `100`

### Get One User

```http
GET /api/users/:id
```

Example:

```http
GET /api/users/64f123...
```

Successful response:

```json
{
  "data": {
    "_id": "...",
    "name": "John",
    "email": "john@example.com"
  }
}
```

### Update a User

`PUT` replaces the user's editable fields.

```http
PUT /api/users/:id
```

Example request body:

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

Both `name` and `email` are required for a PUT request.

### Partially Update a User

`PATCH` updates only the fields provided.

```http
PATCH /api/users/:id
```

Example:

```json
{
  "name": "John Smith"
}
```

Only `name` is changed.

Currently, only these fields can be updated:

```text
name
email
```

### Delete a User

```http
DELETE /api/users/:id
```

Successful response:

```json
{
  "message": "User deleted successfully"
}
```

## User Validation

The `User` model validates:

### Name

- Required
- Whitespace is trimmed
- Minimum length is 2 characters

### Email

- Required
- Whitespace is trimmed
- Converted to lowercase
- Must match the expected email format

Update operations also run Mongoose validation.

## Error Handling

Errors are handled by a centralized error-handling middleware.

Common responses include:

### 400 Bad Request

Used when the request is invalid.

Example:

```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Please enter a valid email address"
  }
}
```

### 404 Not Found

Used when the requested user does not exist.

```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error

Used for unexpected server-side errors.

```json
{
  "message": "Internal server error"
}
```

## Development

Nodemon is used during development so the server automatically restarts when files change.

Start development mode with:

```bash
npm run dev
```

## Available npm Scripts

```text
npm run dev       Start MongoDB and the API in development mode
npm start         Start the API normally
npm run db:up     Start MongoDB
npm run db:down   Stop MongoDB
```

## Current API Routes

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/api/users`     | Create a user           |
| GET    | `/api/users`     | Get users               |
| GET    | `/api/users/:id` | Get one user            |
| PUT    | `/api/users/:id` | Replace user data       |
| PATCH  | `/api/users/:id` | Partially update a user |
| DELETE | `/api/users/:id` | Delete a user           |

## License

ISC

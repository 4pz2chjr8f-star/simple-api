# Simple API

A REST API built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**.

This project is a learning project for understanding REST API design, database operations, request validation, authentication, authorization, and middleware using JavaScript ES modules.

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- Docker and Docker Compose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- dotenv for environment variables
- Nodemon for development
- Postman for API testing

## Project Structure

```text
simple-api/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── pagination.js
│   │   └── requestLogger.js
│   ├── models/
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js
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

- Node.js and npm
- Docker Desktop
- Postman (for testing the API)

## Installation

Install the project dependencies from the project root:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/simple_api
JWT_SECRET=replace-with-a-long-random-secret
```

Replace the JWT secret with a strong, randomly generated secret before using the application beyond local learning.

**Security:** Never commit `.env` to version control or share your JWT secret. Keep `.env` in `.gitignore`.

## Running the Project

Start the application in development mode:

```bash
npm run dev
```

This command starts MongoDB using Docker Compose and runs the Node.js server with Nodemon.

The API will be available at:

```text
http://localhost:3000
```

MongoDB is available locally at:

```text
mongodb://localhost:27017/simple_api
```

### Stopping the Project

Stop the Node.js development server with `Ctrl + C`.

Stop MongoDB separately:

```bash
npm run db:down
```

Start MongoDB again:

```bash
npm run db:up
```

The database uses a Docker volume to persist data when the container is stopped and restarted.

## Environment Variables

| Variable      | Description                         |
| ------------- | ----------------------------------- |
| `PORT`        | Port used by the Express server     |
| `MONGODB_URI` | MongoDB connection string           |
| `JWT_SECRET`  | Secret used to sign and verify JWTs |

## Authentication and Authorization

The API uses JSON Web Tokens (JWT) to authenticate users.

### Authentication

Authentication verifies who is making a request.

1. A user logs in with their email and password.
2. The API checks the submitted credentials.
3. If they are valid, the API returns a signed JWT.
4. The client sends that token with requests to protected endpoints.

Use the `Authorization` header with the `Bearer` scheme:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens expire after one hour.

### Authorization

Authorization determines which actions an authenticated user is allowed to perform.

Each user has a role:

- `user` — the default role for registered users.
- `admin` — can access endpoints restricted to administrators.

The `auth` middleware verifies the JWT. The `authorize` middleware checks whether the user's role is allowed to access a route.

Public registration does not accept a client-supplied role. Normal profile updates also cannot change a user's role.

Admin privileges should be granted only through a trusted administrative process, not through a public API endpoint.

## API Endpoints

Base URL:

```text
http://localhost:3000
```

### Authentication Routes

| Method | Endpoint          | Access        | Description                        |
| ------ | ----------------- | ------------- | ---------------------------------- |
| POST   | `/api/auth/login` | Public        | Log in and receive a JWT           |
| GET    | `/api/auth/me`    | Authenticated | Get the current user's information |

### User Routes

| Method | Endpoint         | Access        | Description                        |
| ------ | ---------------- | ------------- | ---------------------------------- |
| POST   | `/api/users`     | Public        | Register a user                    |
| GET    | `/api/users`     | Admin         | List users with pagination         |
| GET    | `/api/users/:id` | Authenticated | Get one user                       |
| PUT    | `/api/users/:id` | Authenticated | Update name and email              |
| PATCH  | `/api/users/:id` | Authenticated | Partially update name and/or email |
| DELETE | `/api/users/:id` | Admin         | Delete a user                      |

Protected endpoints require a valid JWT. Admin-only endpoints also require the user's role to be `admin`.

## Authentication Examples

### Register a User

```http
POST /api/users
Content-Type: application/json
```

Request body:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "secret123"
}
```

The password is hashed before it is stored in the database. The API does not return the password in the registration response.

New users receive the `user` role by default. Any `role` field supplied by the client is ignored during registration.

### Log In

```http
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

A successful login returns a token:

```json
{
  "token": "YOUR_JWT_TOKEN"
}
```

Use the returned token to authenticate protected requests.

Invalid credentials return `401 Unauthorized`.

### Get the Current User

```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

Returns the information for the user identified by the token.

## User Management Examples

### Get Users

Only administrators can access this endpoint.

```http
GET /api/users
Authorization: Bearer YOUR_ADMIN_TOKEN
```

The endpoint supports pagination:

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
      "email": "john@example.com",
      "role": "user"
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

Pagination settings:

- Default page: `1`
- Default limit: `10`
- Minimum page: `1`
- Minimum limit: `1`
- Maximum limit: `100`

### Get One User

```http
GET /api/users/USER_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

Replace `USER_ID` with the user's MongoDB document ID.

### Update a User

`PUT` requires both editable fields: `name` and `email`.

```http
PUT /api/users/USER_ID
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Request body:

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

### Partially Update a User

`PATCH` updates only the supplied editable fields.

```http
PATCH /api/users/USER_ID
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

Request body:

```json
{
  "name": "John Smith"
}
```

Only `name` and `email` are allowed. Attempts to update fields such as `role` or `password` through this endpoint are rejected.

### Delete a User

Only administrators can delete users.

```http
DELETE /api/users/USER_ID
Authorization: Bearer YOUR_ADMIN_TOKEN
```

A successful deletion returns:

```http
204 No Content
```

A `204` response has no response body.

## User Model and Validation

The user model is defined in `src/models/user.js`.

### Name

- Required
- Whitespace is trimmed
- Minimum length: 2 characters

### Email

- Required
- Whitespace is trimmed
- Converted to lowercase
- Must match the expected email format

### Password

- Required during registration
- Minimum length: 6 characters
- Hashed using bcryptjs before storage
- Excluded from normal query results by default

### Role

- Allowed values: `user` and `admin`
- Defaults to `user`
- Cannot be set through public registration or normal profile updates

Mongoose validation also runs during user update operations where configured.

## Middleware

The application uses middleware to keep request handling organized.

- `auth.js` — verifies JWTs and attaches the token payload to `req.user`.
- `authorize.js` — restricts access based on user roles.
- `pagination.js` — validates pagination parameters and prepares pagination values.
- `requestLogger.js` — logs incoming requests.
- `errorHandler.js` — handles errors centrally.

## Error Handling

Common HTTP status codes used by the API include:

| Status                      | Meaning                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `200 OK`                    | Request succeeded                                                |
| `201 Created`               | A user was created                                               |
| `204 No Content`            | A user was deleted successfully                                  |
| `400 Bad Request`           | Invalid request or disallowed fields                             |
| `401 Unauthorized`          | Missing, invalid, or expired token; or invalid login credentials |
| `403 Forbidden`             | Authenticated user lacks the required permissions                |
| `404 Not Found`             | Requested user does not exist                                    |
| `500 Internal Server Error` | Unexpected server error                                          |

The centralized error handler processes errors passed to it by route handlers and controllers.

## Testing with Postman

To test the API:

1. Start the project with `npm run dev`.
2. Register a user using `POST /api/users`.
3. Log in using `POST /api/auth/login`.
4. Copy the token from the response.
5. For protected requests, open the **Authorization** tab in Postman, select **Bearer Token**, and paste the token.
6. Test a regular user's permissions and compare them with an administrator's permissions.

Expected authorization behavior:

- A protected request without a valid token returns `401`.
- A regular user accessing an admin-only endpoint receives `403`.
- An administrator with a valid token can access admin-only endpoints.

## Available npm Scripts

```bash
npm run dev       # Start MongoDB and the API in development mode
npm start         # Start the API
npm run db:up     # Start MongoDB
npm run db:down   # Stop MongoDB
```

## License

ISC

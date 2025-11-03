# Fix Master Backend API Documentation

This document provides a comprehensive overview of the RESTful API endpoints for the Fix Master Backend. The API is built with Express.js, TypeScript, and follows a clean architecture. It handles user registration and login with JWT-based authentication.

**Base URL**: `http://localhost:5000/api` (adjust for production deployment).

**General Notes**:
- All requests must use `Content-Type: application/json`.
- Responses are in JSON format.
- JWT tokens are issued on successful register/login and expire in 7 days.
- Security: Passwords are hashed with bcrypt (salt rounds: 12). Use HTTPS in production.
- Error Handling: Standardized responses with `success` boolean and `message` for errors.
- Validation: Enforced via Mongoose schema (required fields, uniqueness, min length).

## Authentication Flow
1. **Register**: Create a new user → Receive JWT token and user profile.
2. **Login**: Authenticate with email/password → Receive JWT token and user profile.
3. **Protected Routes** (Future): Use JWT in `Authorization: Bearer <token>` header (not implemented yet).

## Endpoints

### 1. User Registration
**POST** `/auth/register`

Registers a new user. Validates uniqueness of email, username, and phone. Hashes the password before storage.

#### Request Body
| Parameter | Type   | Required | Description                          | Constraints                          |
|-----------|--------|----------|--------------------------------------|--------------------------------------|
| `email`   | string | Yes      | User's email address                 | Unique, lowercase, trimmed           |
| `username`| string | Yes      | Unique display name                  | Unique, lowercase, trimmed           |
| `phone`   | string | Yes      | Phone number (international format)  | Unique, trimmed                      |
| `address` | string | Yes      | Full physical address                | Trimmed, no length limit             |
| `password`| string | Yes      | User's password                      | Minimum 6 characters                 |

**Example Request**:
```json
{
  "email": "john.doe@example.com",
  "username": "johndoe",
  "phone": "+1-555-0123",
  "address": "123 Elm Street, Springfield, IL 62701",
  "password": "securePass123!"
}
```

#### Response
- **201 Created** (Success):
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGYxMjM0NTY3ODkwMTIzNDU2Nzg5IiwiaWF0IjoxNzM1NDMyMDAwLCJleHAiOjE3MzYwMzY4MDB9.signature",
    "user": {
      "id": "64f1234567890123456789",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "phone": "+1-555-0123",
      "address": "123 Elm Street, Springfield, IL 62701"
    }
  }
  ```
- **400 Bad Request** (Validation Error or Duplicate):
  ```json
  {
    "success": false,
    "message": "User already exists with this email"
  }
  ```
  - Other examples: "password must be at least 6 characters" or MongoDB validation details.

### 2. User Login
**POST** `/auth/login`

Authenticates an existing user by email and password. Returns a JWT token and user profile (password excluded).

#### Request Body
| Parameter | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `email`   | string | Yes      | User's email address         |
| `password`| string | Yes      | User's password              |

**Example Request**:
```json
{
  "email": "john.doe@example.com",
  "password": "securePass123!"
}
```

#### Response
- **200 OK** (Success):
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGYxMjM0NTY3ODkwMTIzNDU2Nzg5IiwiaWF0IjoxNzM1NDMyMDAwLCJleHAiOjE3MzYwMzY4MDB9.signature",
    "user": {
      "id": "64f1234567890123456789",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "phone": "+1-555-0123",
      "address": "123 Elm Street, Springfield, IL 62701"
    }
  }
  ```
- **401 Unauthorized** (Invalid Credentials):
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```
  - Covers non-existent user or incorrect password.

### 3. Health Check (Root)
**GET** `/`

Simple endpoint to verify server status (not under `/api/auth`).

#### Response
- **200 OK**:
  ```
  User Auth Backend is running!
  ```

## Error Responses
All errors follow this structure:
```json
{
  "success": false,
  "message": "Detailed error description"
}
```

| HTTP Status | Common Causes |
|-------------|---------------|
| **400 Bad Request** | Missing/invalid fields, duplicates (email/username/phone), schema violations (e.g., short password). |
| **401 Unauthorized** | Incorrect email/password during login. |
| **500 Internal Server Error** | Database connection issues, unhandled exceptions (logged to console). |

## Testing the API
Use tools like Postman, Insomnia, or cURL.

### cURL Examples
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "phone": "+1234567890",
    "address": "123 Test Street",
    "password": "testpass123"
  }'

# Login with the user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Health check
curl http://localhost:5000/
```

### Postman Collection
1. Create a new collection named "User Auth API".
2. Add the two POST requests with the examples above.
3. Set up environment variables for base URL and tokens.

## Security Considerations
- **JWT Secret**: Keep `JWT_SECRET` secure and rotate periodically.
- **Input Sanitization**: Mongoose trims/lowercases fields; add client-side validation.
- **Rate Limiting**: Not implemented—add `express-rate-limit` for production to prevent brute-force attacks.
- **CORS**: Not configured—add if frontend is on a different domain.
- **Password Policy**: Enforce stronger rules (e.g., regex for complexity) in future updates.

## Future Enhancements
- **Profile Update**: PUT `/profile` (protected with JWT middleware).
- **Password Reset**: POST `/reset-password` with email token flow.
- **User List**: GET `/users` (paginated, protected).
- **Email Verification**: Integrate Nodemailer for OTPs.
- **Swagger/OpenAPI**: Auto-generate docs with `swagger-jsdoc`.

For setup instructions, see [README.md](README.md). If you encounter issues, check console logs or open an issue.

**Version**: 1.0.0  
**Last Updated**: November 02, 2025
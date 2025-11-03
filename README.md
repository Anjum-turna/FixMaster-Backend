# Fix Master Backend

A robust **TypeScript Node.js** backend for Fix Master using **Express**, **Mongoose** (MongoDB ODM), **bcrypt** for password hashing, and **JWT** for token-based authentication.  
Follows a clean architecture with models, routes, controllers, services, and middlewares.

---

## 🚀 Features
- **User Registration** – Create users with email, username, phone, address, and hashed password.  
- **User Login** – Authenticate with email/password, returning JWT token and user profile (excluding password).  
- **Validation** – Schema-level validation for required fields, uniqueness (email, username, phone), and minimum password length (6 characters).  
- **Security** – Password hashing with bcrypt, JWT tokens (7-day expiry), and centralized error handling.  
- **Scalable Architecture** – Separation of concerns for easy maintenance and testing.

---

## 🛠 Tech Stack
| Category | Tools |
|-----------|--------|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Auth** | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`) |
| **Language** | TypeScript |
| **Dev Tools** | ts-node-dev for hot reload |

---

## 📂 Project Structure
```
user-auth-backend/
├── src/
│   ├── config/          # Database connection
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   └── app.ts           # Main app entry
├── .env.example         # Env vars template
├── package.json         # Dependencies
├── README.md            # This file
├── tsconfig.json        # TS config
└── API.md               # API Documentation
```

---

## ⚙️ Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- npm or yarn

---

## 🧩 Setup & Installation

1. **Clone/Setup Project**
   ```bash
   git clone <repo-url> user-auth-backend
   cd user-auth-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Copy `.env.example` to `.env` and configure:
   ```bash
   MONGO_URI=mongodb://localhost:27017/userauthdb  # Or your MongoDB connection string
   JWT_SECRET=your_super_secret_jwt_key_here       # Generate a strong secret (e.g., via openssl rand -hex 32)
   PORT=5000                                       # Optional: Default 5000
   ```

4. **Run the Server**
   ```bash
   # Development (with hot-reload)
   npm run dev

   # Build & Production
   npm run build && npm start
   ```

5. **Verify**
   - Server starts on `http://localhost:5000`
   - Health check: `GET /` → _"User Auth Backend is running!"_

---

## 🧪 Testing

Use Postman, Insomnia, or curl to test endpoints.  
See [API Documentation](API.md) for full endpoint details.

**Example with curl:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register   -H "Content-Type: application/json"   -d '{"email":"john@example.com","username":"john","phone":"+123456789","address":"123 St","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"john@example.com","password":"pass123"}'
```

---

## ⚠️ Error Handling
- Global error middleware catches unhandled errors → `500: "Something went wrong!"`
- Endpoint-specific:
  - `400` → Validation/Duplicate
  - `401` → Authentication failure
- Logs errors to console for debugging.

---

## 🧱 Extending the Project
- **Protected Routes** – Add JWT middleware (`verifyToken`) and apply to new routes.  
- **Validation** – Integrate `joi` or `zod` for request body validation.  
- **Testing** – Add Jest/Supertest for unit & integration tests.  
- **Deployment** – Use PM2 or Docker for production; Heroku/Vercel for quick deploy.

---

## 🤝 Contributing
1. Fork the repository.  
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.

---

```dockerfile
# Multi-stage Dockerfile for User Auth Backend
# Stage 1: Build (compile TypeScript)
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Stage 2: Runtime (production-optimized)
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files from builder
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built artifacts from builder
COPY --from=builder /app/dist/ ./dist/

# Copy .env (or use ARG/ENV for secrets in production)
COPY .env ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 5000

# Health check (optional: ping the health endpoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/', (res) => { if (res.statusCode !== 200) process.exit(1) })"

# Start the application
CMD ["npm", "start"]
```

## Docker Usage Instructions

### Build the Image
```bash
docker build -t user-auth-backend .
```

### Run the Container
```bash
# Basic run (expose port 5000, map to host)
docker run -p 5000:5000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/userauthdb \
  -e JWT_SECRET=your_super_secret_jwt_key_here \
  --name user-auth-app \
  user-auth-backend
```

- **Env Vars**: Pass `MONGO_URI`, `JWT_SECRET`, etc., via `-e` flags. Do **not** commit `.env` to Git; use Docker secrets or orchestrators like Docker Compose for production.
- **MongoDB**: Run MongoDB separately (e.g., via Docker: `docker run -p 27017:27017 mongo`). Use `host.docker.internal` for host-DB access in dev.
- **Docker Compose** (Optional): Create a `docker-compose.yml` for app + MongoDB stack.

### Optimizations
- **Alpine Base**: Keeps image small (~150MB).
- **Multi-Stage**: Excludes dev deps and source in final image.
- **Non-Root User**: Enhances security.
- **Health Check**: Monitors `/` endpoint.

Test: After running, hit `http://localhost:5000/` for "User Auth Backend is running!" and test `/api/auth/register` as before. If issues (e.g., DB connection), check logs with `docker logs user-auth-app`.

---

## 🧾 License
MIT License – free to use, modify, and distribute.

---

## 📬 Contact
Questions or issues?  
Open an issue in the repository or reach out directly.
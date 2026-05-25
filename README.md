# Bookshelf API

A production-ready RESTful API for managing your personal book collection. Track books you want to read, are currently reading, or have finished.

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | PostgreSQL |
| Authentication | JWT + bcryptjs |
| Validation | express-validator |
| Documentation | Swagger (OpenAPI 3.0) |
| Security | Helmet, CORS, Rate Limiting |
| Logging | Morgan |

## Features

- **User Authentication** — Register, login, and JWT-based protected routes
- **Book Collection Management** — Full CRUD operations on your personal bookshelf
- **Reading Status Tracking** — Categorize books as _want-to-read_, _reading_, or _finished_
- **Rate Limiting** — 100 req/15min globally, 5 req/15min on auth endpoints
- **Input Validation** — Request body validation on all write endpoints
- **Error Handling** — Clean JSON error responses with proper status codes
- **Security Headers** — Helmet middleware for secure HTTP headers
- **Request Logging** — Morgan logger in dev mode
- **API Documentation** — Interactive Swagger UI at `/api-docs`
- **Postman Collection** — Ready-to-import collection with environment variables

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** >= 14

### Installation

```bash
git clone <repo-url> bookshelf-api
cd bookshelf-api
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | (empty) |
| `DB_NAME` | PostgreSQL database name | `bookshelf_api` |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |

### Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE bookshelf_api;"

# Run migrations
node src/config/migrate.js
```

### Running the API

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:3000`.

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive JWT |
| `GET` | `/api/auth/me` | Yes | Get current user profile |

### Books

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/books` | Yes | Get all books (`?status=` filter) |
| `GET` | `/api/books/:id` | Yes | Get a single book |
| `POST` | `/api/books` | Yes | Add a new book |
| `PUT` | `/api/books/:id` | Yes | Update a book |
| `DELETE` | `/api/books/:id` | Yes | Delete a book |

### API Documentation

Interactive Swagger UI is available at:

```
http://localhost:3000/api-docs
```

### Postman Collection

Import `postman/bookshelf-api.json` into Postman. The collection includes:
- All 8 endpoints with example request bodies
- A `{{token}}` collection variable auto-populated after login
- A `{{baseUrl}}` variable for environment switching

## Project Structure

```
src/
├── config/
│   ├── database.js      # PostgreSQL connection pool
│   ├── init.sql          # Database schema
│   └── migrate.js       # Migration runner
├── controllers/
│   ├── authController.js # Register, login, getMe
│   └── booksController.js # CRUD operations
├── middleware/
│   ├── auth.js           # JWT verification
│   └── errorHandler.js   # Global error handler
├── routes/
│   ├── auth.js           # Auth routes
│   └── books.js          # Books routes
└── index.js              # Express app entry point
docs/
└── swagger.yaml           # OpenAPI specification
postman/
└── bookshelf-api.json     # Postman collection
```

## Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

```bash
docker build -t bookshelf-api .
docker run -p 3000:3000 --env-file .env bookshelf-api
```

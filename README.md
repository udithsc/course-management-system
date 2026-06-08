# 🎓 UDT Course Manager

A state-of-the-art, modern platform designed for the seamless administration, documentation, reporting, and delivery of educational courses and training programs. 

Featuring a powerful **React 19** frontend and a high-performance **Express 5** backend using **Prisma 7** for database management.

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **UI Architecture:** Material UI 7 + Emotion
- **State Management:** Redux Toolkit
- **Animations:** Framer Motion 12
- **Utilities:** Day.js, Ioo, Redux, JWT-decode

### Backend
- **Engine:** Node.js 24 + Express 5
- **ORM:** Prisma 7 + PostgreSQL (Supabase)
- **Security:** JWT, BcryptJS, Helmet, Express-Rate-Limit
- **API Documentation:** Swagger UI
- **Dev Tooling:** TSX (TypeScript Execute), NPM Check Updates, Prettier, Husky

---

## 🛠️ Project Setup

### Prerequisites
- [Node.js 24+](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)

### ⚙️ Initial Configuration

Before running the application, you must configure the environment variables for both services:

1.  **Backend Environment**:
    - Copy `backend/.env.example` to `backend/.env`.
    - Set your `DATABASE_URL` (PostgreSQL), `ACCESS_TOKEN_SECRET`, and `REFRESH_TOKEN_SECRET`.
2.  **Frontend Environment**:
    - Copy `frontend/.env.example` to `frontend/.env`.
    - Ensure `VITE_API_URL` points to your backend index (default: `http://localhost:3001`).

---

### 🐳 Option 1: Running via Docker (Recommended)

Bring up the entire stack with a single command. The architecture is configured to handle Prisma Client generation and database synchronization automatically.

```bash
# From the project root
docker-compose up --build
```

**Access Points:**
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001](http://localhost:3001)
- **Health Check:** [http://localhost:3001/health](http://localhost:3001/health)
- **API Documentation:** [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

### 💻 Option 2: Local Native Setup (Development)

**1. Backend Synchronization**
```bash
cd backend
npm install
npx prisma generate
npm run db:push    # To sync schema with database
npm run db:seed    # To seed initial data
npm start          # Starts server with 'tsx watch'
```

**2. Frontend Preparation**
```bash
cd frontend
npm install
npm start          # Starts Vite dev server
```

---

## 🚀 Deployment Guide

This project can be deployed with Docker Compose or as two separate services: a static frontend and a Node.js backend. The backend requires a PostgreSQL database; the compose files in this repository do not start a database container, so use a managed database such as Supabase, Neon, Railway, Render, or your own PostgreSQL server.

### 1. Prepare Production Environment Variables

Create production values before building or starting the services.

**Backend variables:**

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
PORT=3001
BACKEND_URL="https://api.your-domain.com"
FRONTEND_URL="https://your-domain.com"
ACCESS_TOKEN_SECRET="replace_with_a_long_random_secret"
REFRESH_TOKEN_SECRET="replace_with_a_long_random_secret"
SENDGRID_API_KEY="your_sendgrid_key_or_test"
REQUIRES_AUTH=true
```

**Frontend variables:**

```env
VITE_API_URL="https://api.your-domain.com"
```

For Vite, `VITE_API_URL` is baked into the frontend during `npm run build`, so make sure it is set before building the production frontend image or static files.

### 2. Deploy with Docker Compose

For local development, use:

```bash
docker-compose up --build
```

For production-style deployment, create a root `.env` file with the backend and frontend production variables, then run:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

The production compose file exposes:

- Frontend: `http://server-ip:3000`
- Backend API: `http://server-ip:3001`
- API docs: `http://server-ip:3001/api-docs`
- Health check: `http://server-ip:3001/health`

Place Nginx, Caddy, Traefik, or your hosting provider's reverse proxy in front of these ports to serve HTTPS domains such as:

- `https://your-domain.com` -> frontend service on port `3000`
- `https://api.your-domain.com` -> backend service on port `3001`

### 3. Database Setup

The backend entrypoint runs Prisma automatically when the container starts:

```bash
npx prisma generate
npx prisma db push --accept-data-loss
npm start
```

For a first deployment, you can seed initial data manually:

```bash
docker compose -f docker-compose.prod.yml exec backend npm run db:seed
```

If you run without Docker, use:

```bash
cd backend
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm start
```

### 4. Verify Deployment

After deployment, check:

```bash
curl https://api.your-domain.com/health
```

Then open:

- Frontend: `https://your-domain.com`
- Swagger docs: `https://api.your-domain.com/api-docs`

If the frontend loads but API calls fail, confirm that `VITE_API_URL` points to the deployed backend URL and that `FRONTEND_URL` on the backend matches the public frontend origin.

### 5. Production Notes

- Use strong, unique values for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.
- Keep `.env` files out of Git.
- The production compose file stores backend uploads and logs in Docker volumes.
- Use a managed PostgreSQL backup policy before serving real users.
- Avoid running `prisma db push --accept-data-loss` against sensitive production data unless you have reviewed the schema changes and have a fresh backup.

---

## 📖 API Documentation

The backend features interactive API documentation powered by Swagger. You can explore, test, and integrate with all endpoints directly from the browser:

👉 **[Access API Documentation Here](http://localhost:3001/api-docs)**

---

## 🛡️ Authentication & Initial Access

The system comes pre-seeded with a Super Admin account for initial setup and verification.

| Credential | Value |
| :--- | :--- |
| **Email** | `admin@test.com` |
| **Password** | `admin123` |

---

## ⚙️ Development Highlights & Prisma 7

- **Modern Database Layer**: This project uses **Prisma 7** with a driver adapter (`@prisma/adapter-pg`).
- **Externalized Config**: Database configuration is managed via `backend/prisma.config.ts`, not hardcoded in the schema.
- **Async Efficiency**: Running on Express 5, the backend automatically handles asynchronous errors without the need for additional middleware.
- **Visual Standards**: All frontend components adhere to a premium design system using Material UI with customized themes and smooth transitions.

---

## 🛠️ Development Guide

### ➕ Adding New Models (Database Schema)
1.  Add the new model to `backend/prisma/schema.prisma`.
2.  Generate the updated client: `cd backend && npx prisma generate`.
3.  Synchronize the database: `npm run db:push`.
4.  (Optional) Update `prisma/seed.ts` and run `npm run db:seed`.

### 🛣️ Creating New API Endpoints
1.  Define a new router in `backend/routes/`.
2.  Add Javadoc-style comments to your route handlers for automatic **Swagger** documentation.
3.  Register the router in `backend/startup/routes.ts`.

### 🎨 Frontend Components
1.  Create reusable components in `frontend/src/components`.
2.  Use the Material UI `sx` prop or styled-components for specific styling.
3.  Define state logic in Redux slices within `frontend/src/store`.

---

## 🧪 Testing Guide

This project features comprehensive unit and integration testing across both frontend and backend using **Jest**, **Supertest**, and **Vitest**.

### Backend Tests (Jest & Supertest)
The backend test suite is configured to test isolated units (middlewares, utility classes) as well as full API workflows hitting a real interconnected database using Supertest.

```bash
cd backend

# Run all tests (Unit + Integration)
npm run test

# Run only unit tests
npm run test:unit

# Run only integration tests 
# (Requires database access as defined in .env.test or .env)
npm run test:integration

# Generate coverage report
npm run test:coverage
```

### Frontend Tests (Vitest & Testing Library)
The frontend utilizes Vitest to execute headless lightning-fast unit tests, verifying logic slices (Redux) and React components isolated from DOM interactions securely.

```bash
cd frontend

# Run unit tests
npm run test:unit

# Generate coverage report
npm run test:coverage
```

---

## 🔍 Troubleshooting

| Issue | Likely Cause | Solution |
| :--- | :--- | :--- |
| **Prisma Connection Error** | `DATABASE_URL` is missing or invalid. | Check your `.env` file in the `backend` directory. |
| **`npx prisma generate` Fails** | Environment variables missing during Docker build. | Ensure `backend/prisma.config.ts` has a dummy fallback for `DATABASE_URL`. |
| **Port 3000/3001 Already in Use** | Another process is using the application ports. | Run `lsof -i :3000` to find and kill the process, or change ports in `docker-compose.yml`. |
| **Styles Not Updating** | Browser cache or Vite hot-reload. | Force refresh (Ctrl+F5) or restart the Vite server. |
| **CORS Errors** | Frontend URL mismatch. | Update `backend/startup/cors.ts` to include your specific frontend origin. |

---

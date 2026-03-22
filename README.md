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
    - Set your `DATABASE_URL` (PostgreSQL) and a secure `JWT_SECRET`.
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

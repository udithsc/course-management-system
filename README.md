# UDT Course Manager

A modern platform for the administration, documentation, reporting, and delivery of educational courses and training programs.

## 🚀 Tech Stack

**Frontend:**
- React 19
- Vite
- Material UI
- Redux Toolkit
- Day.js

**Backend:**
- Node.js 24
- Express
- PostgreSQL (Supabase)
- Prisma ORM
- JWT Authentication
- Docker

## 🛠️ Project Setup

### Prerequisites
- Node.js 24+
- Docker and Docker Compose (optional, for containerized running)

### Option 1: Running via Docker Compose (Recommended)
You can bring up the entire stack using Docker.

1. At the root of the project, run:
```bash
docker-compose up --build
```
2. The infrastructure will automatically:
   - Generate the Prisma Client
   - Expose the Backend API at `http://localhost:3001`
   - Expose the Frontend App at `http://localhost:3000`

### Option 2: Running Locally natively via NPM

**1. Backend Setup**
```bash
cd backend
npm install
npx prisma generate
npm start
```
*The backend API will run on http://localhost:3001*

**2. Frontend Setup**
```bash
cd frontend
npm install
npm start
```
*The frontend application will run via Vite on http://localhost:3000*

## 🔑 Default Super Admin
You can log into the initial platform instance with the seeded Super Admin credentials:
- **Email:** `admin@test.com`
- **Password:** `admin123`

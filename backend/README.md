# UDT Course Manager: Backend

This is the high-performance **Express 5** backend for the Course Management System, utilizing **Prisma 7** for database orchestration.

---

## Standalone Execution

To run the backend independently (outside of Docker), follow these steps:

### 1. Installation
The dependency conflicts have been resolved by removing incompatible legacy packages (like `express-async-errors`). Standard installation now works:
```bash
npm install
```

### 2. Database Synchronization
The project uses **Prisma 7** and requires a driver adapter for PostgreSQL.
```bash
npx prisma generate
npm run db:push    # To push schema changes to your database
npm run db:seed    # To seed initial data (Super Admin account)
```

### 3. Startup
Start the server in development mode with `tsx watch`.
```bash
npm start
```

The API will be available at **[http://localhost:3001](http://localhost:3001)**.

---

## 📖 Key Endpoints

- **Health Check**: `GET /health`
- **Swagger Documentation**: `GET /api-docs`
- **Static Assets**: `/files/` (uploads directory)

---

## ⚙️ Prisma 7 Configuration
Prisma is configured via `prisma.config.ts`. Ensure your `.env` file contains a valid `DATABASE_URL`. During image builds or environments without the variable set, a dummy fallback is used to prevent generation errors.

```typescript
// Example .env
DATABASE_URL="postgresql://user:password@host:port/dbname"
```

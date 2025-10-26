# Todo App - Fullstack (Next.js + NestJS + MySQL)

---

## Short description

A simple Todo application with a Next.js frontend, a NestJS backend, and a MySQL database. Features include creating tasks, marking tasks completed, pagination, and simple state persistence. The project includes unit tests for frontend and backend and end-to-end (E2E) tests for the frontend (Playwright) that exercise the full stack.

Tech stack & key functionality
- Frontend: Next.js (React + TS), React Query, Zustand (store), Framer Motion (animations)
  - Features: create task (title + description steps), list not-completed and completed tasks, pagination, toasts/loading states
  - Testing:
    - Unit tests: Jest + React Testing Library (component/unit tests)
    - E2E tests: Playwright (real browser tests that exercise frontend → backend → DB)
- Backend: NestJS (TypeScript), Prisma, MySQL
  - Features: REST API for tasks (create, read, update, pagination)
  - Testing:
    - Unit & integration tests: Jest (includes e2e tests under `test/`)
- Database: MySQL (containerized via docker compose)

Note about E2E: Playwright E2E tests run against the real frontend and backend and will hit the real database. 

---

## Prerequisites

Required:
- Docker & Docker Compose

Optional (only for running frontend tests locally):
- Node.js 22+
- npm (or yarn/pnpm)
- Playwright browsers (for E2E tests - large download)

---
## Environment

Copy the example env and edit if you need different ports

Windows / Linux (from project root)
```bash
cp .env.example .env
```

Edit `.env` to change ports or connection strings (MYSQL_PORT, BACKEND_PORT, FRONTEND_PORT, NEXT_PUBLIC_API_BASE_URL, DATABASE_URL).

Default access (from .env.example)
- Frontend: http://localhost:3001
- Backend API base: http://localhost:3000/api
- MySQL (host): localhost:3308 (mapped host port)

---

## Run with Docker (build + start)

Use docker compose to build and run the full stack (frontend, backend, db).

Windows / Linux (from project root)
```bash
docker compose up --build
```

Stop containers
```bash
docker compose down
```

Access URLs after docker compose up (defaults)
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- MySQL: connect to localhost:3308 (user: root, password: root, database: todo_db)

MySQL command-line client example (Windows /Linux)
```bash
mysql -h 127.0.0.1 -P 3308 -u root -p
```

---

## Tests

Backend (unit tests and integration tests with Docker)
```bash
docker compose run --rm backend npm test
```

Frontend (unit tests)
```bash
cd frontend
npm install
```

```bash
npm run dev
```

```bash
npx jest components/task/__tests__/task.test.tsx
npx jest api/__tests__/service.test.ts
npx jest store/__tests__/taskStore.test.ts
```

Frontend E2E (Playwright)
```bash
cd frontend
npm install
npx playwright install
```

```bash
npm run test:e2e
```

---

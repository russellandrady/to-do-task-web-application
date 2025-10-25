# Todo App — Fullstack (Next.js + NestJS + MySQL)

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
- Database: MySQL (containerized via docker-compose)

Note about E2E: Playwright E2E tests run against the real frontend and backend and will hit the real database. Ensure you run tests against a test database or clean DB between runs.

---

## Prerequisites

- Node.js 18+ / 20 recommended
- npm (or yarn/pnpm)
- Docker & Docker Compose (if you plan to run with Docker)
- (Optional for local E2E) Playwright browsers — large download. See instructions below.

---

## Environment

Copy the example env and edit if you need different ports:

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

Use docker-compose to build and run the full stack (frontend, backend, db).

Windows / Linux (from project root)
```bash
docker compose up --build -d
```

Stop containers:
```bash
docker compose down
```

Access URLs after docker-compose up (defaults):
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- MySQL: connect to localhost:3308 (user: root, password: root, database: todo_db)

MySQL command-line client example (Linux):
```bash
mysql -h 127.0.0.1 -P 3308 -u root -p
```
Windows (PowerShell with mysql client installed):
```powershell
mysql -h 127.0.0.1 -P 3308 -u root -p
```

---

## Tests

Important: Playwright browser binaries are large. They are NOT installed automatically by this repo unless you run the explicit Playwright install step. Do not add a `postinstall` that auto-downloads browsers if you want to avoid forcing large downloads for all developers.

Frontend (unit + e2e)
```bash
cd frontend
npm ci
npm test
```

Frontend E2E (Playwright)
```bash
cd frontend
npm ci
```

Optional one-time step to download browsers (heavy)
```bash
npx playwright install
```

Run Playwright tests
```bash
npm run test:e2e
```
or to run with browser UI / headed
```bash
npm run test:e2e:headed
```

Backend (unit + e2e)
```bash
cd backend
npm ci
npm test
npm run test:e2e
```

---

## Useful commands (summary)

Docker
```bash
docker-compose up --build -d
```

Stop
```bash
docker compose down
```

Tests
```bash
cd frontend && npm test
```

Frontend E2E (one-time browser install required)
```bash
cd frontend
npm ci
npx playwright install
npm run test:e2e
```

Backend tests
```bash
cd backend && npm test
```

---

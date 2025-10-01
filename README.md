# Notion Clone (Full‑stack)

This is a small Notion-like app. 
You can sign up, log in, and create documents. 
You can edit the title and content. 
You can move documents to archive and restore them.

## Tech
- Frontend: Next.js 14, React 18, Chakra UI
- Backend: NestJS 10, TypeORM, JWT Auth
- Database: MySQL 8 (Docker)
- Package manager: pnpm (workspaces)

## Quick Start (Local)
These steps run everything with one command.

1) Install tools
- Install Docker Desktop
- Install pnpm (version 9 or later)

2) Install dependencies
- In the project root:
  - Run: pnpm install

3) Start database
- Run: pnpm db:up
- It starts MySQL on localhost:3306 with user "test" and password "password".

4) Start apps (frontend + backend)
- Run: pnpm dev
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

Note: The frontend reads the backend URL from `frontend/.env.local`.
It is already set to `http://localhost:8080/`.

## Scripts
- pnpm db:up — Start MySQL with Docker
- pnpm db:down — Stop MySQL
- pnpm dev — Start frontend and backend together
- pnpm build — Build all packages

## Environment
Backend default DB settings (from env or defaults):
- Host: localhost
- Port: 3306
- User: test
- Password: password
- DB name: test

If you change them, set these variables before starting the backend:
- DATABASE_HOST
- DATABASE_PORT
- DATABASE_USER
- DATABASE_PASSWORD
- DATABASE_NAME

Frontend uses:
- NEXT_PUBLIC_BACKEND_URL (public, for API base URL)

## Troubleshooting
- Port 3306 already in use: Stop other MySQL or change port in `backend/docker-compose.yml`.
- Frontend can’t reach backend (CORS): Make sure backend is on port 8080 and frontend on port 3000.
- Migrations: If you need DB schema, run in `backend/`: `pnpm typeorm:run-migrations` (after `pnpm build`).

## License
UNLICENSED (for learning/demo).
## Backend (NestJS)

This is the API server.

Tech:
- NestJS (TypeScript)
- TypeORM + MySQL
- JWT (cookie)

### How to run (dev)

1) Install deps in repo root:
- pnpm install

2) Start database (Docker):
- pnpm db:up

3) Set env (optional). Create `backend/.env.local` to override defaults:
```
DATABASE_HOST=localhost
DATABASE_PORT=3307
DATABASE_USER=test
DATABASE_PASSWORD=password
DATABASE_NAME=test
JWT_SECRET=dev-secret
```

4) Start API:
- pnpm --filter backend dev

API runs on http://localhost:3001 (with /api prefix from the gateway).

### Scripts
- dev: start in watch mode
- build: build the app
- test: run unit tests

### Notes
- MySQL runs on host port 3307 (mapped to container 3306). This avoids conflict with local MySQL.
- Cookies store the JWT. CORS is set for local dev.

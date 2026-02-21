# Notes App — Backend

Production-ready backend for a Notes application (Express + Node.js).

## Overview

This repository provides the backend API for a Notes application, including user
authentication, note CRUD, validation, email notifications, and structured
logging. The service is written using Express and is intended to be deployed in
containerized production environments (Docker/Kubernetes).

## Architecture

- Node.js + Express for HTTP API
- MongoDB via connection layer in `src/db`
- Modular structure: `controllers`, `models`, `routes`, `middlewares`, `utils`
- Centralized error handling and request validation
- Email delivery via `emailConfig` and `sendEmail.utils`

## Model

[DB model](https://drawsql.app/teams/indexdothtml/diagrams/notes-app-db-model)

## Production checklist

- Use environment variables for secrets and config (see **Environment** below).
- Run the app inside containers and manage lifecycle with orchestrator (K8s).
- Enforce HTTPS via a reverse proxy / ingress.
- Use a managed database with backups and automated failover.
- Centralized logging (e.g., ELK, Loki) and structured logs (JSON).
- Monitoring and alerting (Prometheus/Grafana, Application Performance Monitoring).
- CI/CD pipeline for linting, testing, building images, and deployment.

## Environment

Create a `.env` file or provide environment variables via your deployment platform.
Common variables used by the codebase (illustrative):

- `NODE_ENV` — `development` / `production`
- `PORT` — port to run the server
- `DATABASE_URL` — connection string to the database
- `JWT_SECRET` — secret for signing JWTs
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` — SMTP config
- `LOG_LEVEL` — `info` / `debug` / `error`

Keep secrets in a secure vault (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault).

## Installation (local development)

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file with required variables.

3. Run in development mode:

```bash
npm run dev
```

4. Start production mode locally:

```bash
npm start
```

## Docker

Build and run with Docker for parity with production:

```bash
docker build -t notes-backend:latest .
docker run -e NODE_ENV=production -p 3000:3000 --env-file .env notes-backend:latest
```

For orchestration use a multi-container deployment and supply environment
variables/secrets through your orchestrator.

## Testing & Quality

- Add unit and integration tests (recommended frameworks: Jest, supertest).
- Run linters and formatters in CI (ESLint, Prettier).
- Include security and dependency scanning in CI (npm audit, Snyk).

## Logging & Error Handling

- Application logs are structured and configurable via `loggerConfig.js`.
- Use correlation IDs for request tracing and include them in logs.
- Handle uncaught exceptions and promise rejections, and shutdown gracefully
  (see `safeShutdown.utils`).

## Security

- Validate and sanitize all inputs (see `validate.middlewares.js`).
- Protect endpoints with authentication and authorization middleware.
- Rate-limit and protect public endpoints at the gateway/ingress.
- Rotate secrets regularly and use short-lived tokens where possible.

## Database & Migrations

- Keep DB schema changes in version-controlled migrations.
- Use connection pooling and tune per-environment settings.
- Regularly back up production data and test restores.

## Observability

- Export metrics and integrate with Prometheus/Grafana.
- Ship traces to an APM provider for slow-request analysis.

## CI/CD Recommendations

- Steps: lint → test → build → containerize → push image → deploy.
- Run integration tests against a staging environment that mirrors production.

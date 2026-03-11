# Financial Planner

A single-page application for tracking personal finances. Users can record income and expenses, organise them into categories, set monthly budgets, and monitor spending progress — all scoped to an anonymous user identity stored in the browser.

## Features

- **Transactions** — add and list income and expense entries with a running account balance and monthly summaries
- **Categories** — create custom categories to tag transactions
- **Budgets** — set monthly spending limits per category and track progress against actual spend
- **Dashboard** — at-a-glance view of account balance and budget status

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TanStack Query, TanStack Form, TanStack Router, Tailwind CSS, shadcn/ui, Radix UI, Recharts |
| Backend | Fastify, Drizzle ORM, SQLite |
| Testing | Vitest (unit), Playwright (E2E) |
| Tooling | Vite, TypeScript, npm workspaces, Lerna |

## Project structure

```
packages/
  api/   – Fastify REST API (port 3000)
  web/   – React SPA (port 3001)
  e2e/   – Playwright end-to-end tests
```

## Getting started

**Prerequisites:** Node.js 20.6+ and npm 10+.

```bash
npm install
```

## Scripts

All scripts below run from the **monorepo root**.

### Development

```bash
npm run dev          # Start API and web dev server concurrently
```

The API is available at `http://localhost:3000` and the web app at `http://localhost:3001`.

### Building

```bash
npm run build        # Production build of all packages
npm run preview      # Serve the production build locally
```

### Testing

```bash
npm test             # Run all unit tests (Vitest) across packages
npm run test:types   # TypeScript type checking across packages
npm run test:e2e     # Run Playwright end-to-end tests
```

The E2E tests start the API and web server automatically if they are not already running.

## What's not production-ready

This is a demo application. The following areas would need attention before a real deployment:

- **Infrastructure** — there is no infrastructure-as-code definition for the application. A production deployment would benefit from an `infrastructure/` package (e.g. Terraform or Pulumi) defining compute, storage, CDN, DNS, and environment-specific configuration — closing the gap left by the missing `.env.production`.
- **Configuration** — only a `.env.development` file is provided. There is no `.env.production` or environment-specific configuration for staging or production deployments. Some values (ports, CORS origin) fall back to hardcoded defaults in code.
- **Authentication** — user identity is a UUID stored in localStorage with no server-side session or token. There is no login, logout, or account recovery.
- **Input validation** — the API validates request bodies via Zod but does not sanitise inputs or enforce all business rules (e.g. negative budget limits are accepted).
- **Error handling** — API errors surface as generic messages in the UI. There is no retry logic, no offline support, and no structured error responses beyond HTTP status codes.
- **Database** — SQLite is embedded in the API process with no connection pooling, no automated migration step for production deployments, and no backup strategy.
- **Dependency injection** — the DI container used in the API is a proof of concept borrowed from a separate side project of mine. It would not be a custom implementation for a project of this scale; a simpler approach or an established library would be more appropriate.
- **Testing coverage** — unit tests cover pure functions; there are no integration tests for the API layer, and E2E coverage is partial.
- **Accessibility** — interactive components (selects, tabs, buttons) use Radix UI primitives which handle keyboard navigation and ARIA out of the box. Colour contrast ratios, landmark regions, and page title updates on navigation have not been audited against WCAG guidelines.
- **Performance** — all transactions are fetched in a single request with no pagination or virtualisation.

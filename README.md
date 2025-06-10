# ServiceBuilder

ServiceBuilder is a low-code platform to visually generate REST APIs on top of existing SQL databases.

## Features
- Connect to PostgreSQL or MySQL using your database credentials.
- Browse tables and views from the schema.
- Build endpoints by selecting tables or writing custom SQL.
- Configure input parameters, output fields, filtering, sorting and paging.
- Preview generated SQL and REST endpoint with OpenAPI docs.
- Export a deployable Node.js project using Express.

## Folder Structure

```
/src
  /frontend
    /components - reusable React components
    /pages      - page level components and app entry
    /styles     - global and component styles
    /services   - API helper functions
  /backend
    /routes     - Express route definitions
    /services   - business logic helpers
    /db         - Prisma schema and database utilities
  /common       - shared types and utilities
/public          - static assets served by the frontend dev server
```

The backend and frontend are completely decoupled and each have their own `package.json`.
Run `npm install` inside `src/backend` and `src/frontend` and then start them with `npm run dev`.

Configuration values such as database credentials are loaded from environment variables. Copy `.env.example` to `.env` in both the `src/backend` and `src/frontend` folders and update the values before starting the apps.

## Getting Started

1. Install dependencies:

```bash
cd src/backend && npm install
cd ../frontend && npm install
```

2. Start the development servers in two terminals:

```bash
npm run dev       # from src/backend
npm run dev       # from src/frontend
```

3. Connect to a PostgreSQL database. The sample `.env.example` is configured for a local database running on port 5432. Update the values to match your environment.

4. Generate an API by stepping through the wizard. After clicking **Generate**, the endpoint will be available at `/api/generated/<name>` and documented under `/docs`.

Example:

```bash
curl http://localhost:3001/api/generated/usersList
```

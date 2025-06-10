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

Configuration values such as database credentials are loaded from environment variables. Copy `.env.example` to `.env` and update the values before starting the backend.

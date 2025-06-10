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
- **backend/** – Express server with Prisma for database access and dynamic endpoint generation.
- **frontend/** – React + TypeScript + Vite web application.

Run `npm install` inside each folder and then `npm run dev` to start.

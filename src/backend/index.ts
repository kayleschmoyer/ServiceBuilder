import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { router as apiRouter } from './routes/api';
import swaggerUi from 'swagger-ui-express';
import { openApiDoc } from './openapi';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Read database connection settings from environment variables
const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_PROVIDER } = process.env;

// Throw a clear error if any required variable is missing
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error('Database configuration variables are missing');
}

// Build the Prisma connection URL
const dbUrl =
  process.env.DATABASE_URL ||
  `${DB_PROVIDER || 'postgresql'}://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

let prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

export const getPrisma = () => prisma;
export const setPrisma = (client: PrismaClient) => { prisma = client; };

// Mount API routes and Swagger UI
app.use('/api', apiRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { router as apiRouter } from './routes/api';
import swaggerUi from 'swagger-ui-express';
import { openApiDoc } from './openapi';

const app = express();
app.use(cors());
app.use(express.json());

export const prisma = new PrismaClient();

app.use('/api', apiRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

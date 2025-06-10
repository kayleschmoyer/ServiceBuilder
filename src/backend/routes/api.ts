import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getPrisma, setPrisma } from '../index';
import { openApiDoc, generatedApis } from '../openapi';

export const router = Router();

router.post('/connect', async (req: Request, res: Response) => {
  const { host, port, user, password, database, provider } = req.body;
  const url = req.body.url || `${provider || 'postgresql'}://${user}:${password}@${host}:${port}/${database}`;
  try {
    const prisma = getPrisma();
    await prisma.$disconnect();
    const newClient = new PrismaClient({ datasources: { db: { url } } });
    await newClient.$connect();
    setPrisma(newClient);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// Return a list of tables for the current connection
router.get('/tables', async (_req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const tables = await prisma.$queryRaw<{ table_name: string }[]>`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    res.json(tables.map((t: { table_name: string }) => t.table_name));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// Return the column names for a specific table
(router as any).get('/columns', async (req: Request, res: Response) => {
  const { table } = req.query;
  if (!table) return res.status(400).json({ error: 'table parameter required' });
  try {
    const prisma = getPrisma();
    const cols = await prisma.$queryRaw<{ column_name: string }[]>`SELECT column_name FROM information_schema.columns WHERE table_name = ${table}`;
    res.json(cols.map((c: { column_name: string }) => c.column_name));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// Example endpoint generation route
router.post('/generate', async (req: Request, res: Response) => {
  const { name, sql } = req.body;

  // Store the definition so it can be displayed later
  generatedApis[name] = { sql };

  (openApiDoc.paths as any)[`/generated/${name}`] = {
    get: {
      summary: `Generated endpoint ${name}`,
      responses: {
        '200': { description: 'Success' }
      }
    }
  };

  // Attach the new endpoint handler
  (router as any).get(`/generated/${name}`, async (_req: Request, resp: Response) => {
    const prisma = getPrisma();
    const result = await prisma.$queryRawUnsafe(sql);
    resp.json(result);
  });

  console.log('Generated endpoint', name, sql);
  res.json({ path: `/generated/${name}` });
});

router.post('/preview', async (req: Request, res: Response) => {
  const { sql } = req.body;
  try {
    const prisma = getPrisma();
    const result = await prisma.$queryRawUnsafe(`${sql} LIMIT 20`);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

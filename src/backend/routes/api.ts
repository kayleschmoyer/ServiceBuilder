import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getPrisma, setPrisma } from '../index';
import { openApiDoc } from '../openapi';

export const router = Router();

router.post('/connect', async (req, res) => {
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

router.get('/tables', async (req, res) => {
  try {
    const prisma = getPrisma();
    const tables = await prisma.$queryRaw<{ table_name: string }[]>`SELECT table_name FROM information_schema.tables WHERE table_schema = database()`;
    res.json(tables.map((t: { table_name: string }) => t.table_name));
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

// Example endpoint generation route
router.post('/generate', async (req, res) => {
  const { name, sql } = req.body;
  (openApiDoc.paths as any)[`/generated/${name}`] = {
    get: {
      summary: `Generated endpoint ${name}`,
      responses: {
        '200': { description: 'Success' }
      }
    }
  };
  router.get(`/generated/${name}`, async (_req: Request, resp: Response) => {
    const prisma = getPrisma();
    const result = await prisma.$queryRawUnsafe(sql);
    resp.json(result);
  });
  res.json({ path: `/generated/${name}` });
});

router.post('/preview', async (req, res) => {
  const { sql } = req.body;
  try {
    const prisma = getPrisma();
    const result = await prisma.$queryRawUnsafe(`${sql} LIMIT 20`);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

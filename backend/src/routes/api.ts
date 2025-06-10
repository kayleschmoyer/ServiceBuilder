import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { openApiDoc } from '../openapi';

export const router = Router();

router.post('/connect', async (req, res) => {
  const { provider, url } = req.body;
  try {
    prisma.$disconnect();
    prisma.$connect();
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

router.get('/tables', async (req, res) => {
  try {
    const tables = await prisma.$queryRaw<{ table_name: string }[]>`SELECT table_name FROM information_schema.tables WHERE table_schema=database()`;
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
    const result = await prisma.$queryRawUnsafe(sql);
    resp.json(result);
  });
  res.json({ path: `/generated/${name}` });
});

import { Router, Request, Response } from 'express';
import { withDb } from '../utils/db';
import { DbConfig } from '../config';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { user, password, host, port, database } = req.body;
  const dbConfig: DbConfig = { host, port: parseInt(port, 10), user, password, database };
  try {
    const tableNames = await withDb(dbConfig, async pool => {
      const result = await pool.request().query(`
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
      `);
      return result.recordset.map(row => row.TABLE_NAME);
    });
    res.json({ tables: tableNames });
  } catch (err: any) {
    console.error('[TABLES ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

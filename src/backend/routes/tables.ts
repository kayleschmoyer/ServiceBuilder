import { Router, Request, Response } from 'express';
import mssql from 'mssql';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { user, password, host, port, database } = req.body;

  try {
    const pool = await mssql.connect({
      user,
      password,
      server: host,
      port: parseInt(port, 10),
      database,
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    });

    const result = await pool.request().query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);

    await pool.close();

    const tableNames = result.recordset.map(row => row.TABLE_NAME);
    res.json({ tables: tableNames });

  } catch (err: any) {
    console.error('[TABLES ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

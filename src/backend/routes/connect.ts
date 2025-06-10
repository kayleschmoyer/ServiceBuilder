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

    await pool.close();
    res.json({ success: true, message: 'Connected successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

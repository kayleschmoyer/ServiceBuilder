import { Router, Request, Response } from 'express';
import { withDb } from '../utils/db';
import { DbConfig } from '../config';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { user, password, host, port, database } = req.body;
  const dbConfig: DbConfig = { host, port: parseInt(port, 10), user, password, database };

  try {
    await withDb(dbConfig, async () => {});
    res.json({ success: true, message: 'Connected successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

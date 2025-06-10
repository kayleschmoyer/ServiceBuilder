import express from 'express';
const { Router } = express;
import type { Request, Response } from 'express';
import { withDb } from '../utils/db';
import { DbConfig } from '../config';
import { applyColumnMap, formatCSV, formatJSON, ColumnMap } from '../services/formatter';
import { uploadViaSFTP, SftpConfig } from '../services/sftp';

const router = Router();

router.post('/', async function (
  req: Request,
  res: Response
): Promise<void> {
  const { connection, query, export: exportOpts, sftp } = req.body;

  if (!connection || !query) {
    res.status(400).json({ error: 'Missing connection or query' });
    return;
  }

  try {
    const dbConfig: DbConfig = {
      host: connection.host,
      port: parseInt(connection.port, 10),
      user: connection.user,
      password: connection.password,
      database: connection.database,
    };

    const result = await withDb(dbConfig, pool => pool.request().query(query));

    let rows = result.recordset as any[];

    if (exportOpts?.columns) {
      rows = applyColumnMap(rows, exportOpts.columns as ColumnMap[]);
    }

    let fileContent: string;
    const format = exportOpts?.format || 'csv';
    const delimiter = exportOpts?.delimiter || ',';
    const filename = exportOpts?.filename || `export_${Date.now()}.${format}`;

    if (format === 'json') {
      fileContent = formatJSON(rows);
    } else {
      fileContent = formatCSV(rows, delimiter);
    }

    if (sftp) {
      const sftpConfig: SftpConfig = {
        host: sftp.host,
        port: parseInt(sftp.port, 10),
        username: sftp.username,
        password: sftp.password,
        remoteDir: `${sftp.path}/${filename}`
      };

      await uploadViaSFTP(sftpConfig, filename, Buffer.from(fileContent, 'utf8'));
    }

    res.json({
      status: 'success',
      preview: rows.slice(0, 5),
      format,
      filename
    });

  } catch (error: any) {
    console.error('[EXPORT ERROR]', error);
    res.status(500).json({ error: error.message || 'Unexpected server error' });
  }
}); // 👈 closes router.post()

export default router;

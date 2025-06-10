import { Router } from 'express';
import mssql from 'mssql';
import { applyColumnMap, formatCSV, formatJSON, ColumnMap } from '../services/formatter';
import { uploadViaSFTP, SftpConfig } from '../services/sftp';

export const router = Router();

router.post('/', async (req, res) => {
  const { connection, query, export: exportOpts, sftp } = req.body;
  if (!connection || !query) {
    return res.status(400).json({ error: 'Missing connection or query' });
  }
  try {
    const pool = await mssql.connect({
      user: connection.user,
      password: connection.password,
      server: connection.host,
      port: parseInt(connection.port, 10),
      database: connection.database,
      options: { encrypt: false }
    });
    const result = await pool.request().query(query);
    await pool.close();
    const rows = result.recordset;
    const mapped = exportOpts?.columns
      ? applyColumnMap(rows, exportOpts.columns as ColumnMap[])
      : rows;
    const ordered = mapped; // reorder already handled in applyColumnMap order
    let content = '';
    if (exportOpts?.format === 'json') {
      content = formatJSON(ordered);
    } else {
      content = formatCSV(ordered, exportOpts?.delimiter || ',');
    }
    const buffer = Buffer.from(content, 'utf8');
    let uploaded = false;
    let uploadError: string | undefined;
    if (sftp?.enabled) {
      try {
        const cfg: SftpConfig = {
          host: sftp.host,
          port: parseInt(sftp.port, 10) || 22,
          username: sftp.username,
          password: sftp.password,
          remoteDir: sftp.remoteDir
        };
        await uploadViaSFTP(cfg, `${exportOpts.fileName}.${exportOpts.format}`, buffer);
        uploaded = true;
      } catch (e) {
        uploadError = String(e);
      }
    }
    const preview = ordered.slice(0, 5);
    res.json({ preview, uploaded, uploadError });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

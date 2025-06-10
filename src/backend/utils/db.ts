import mssql from 'mssql';
import { DbConfig } from '../config';

export async function withDb<T>(config: DbConfig, fn: (pool: mssql.ConnectionPool) => Promise<T>): Promise<T> {
  const pool = await mssql.connect({
    user: config.user,
    password: config.password,
    server: config.host,
    port: config.port,
    database: config.database,
    options: { encrypt: false, trustServerCertificate: true },
  });
  try {
    return await fn(pool);
  } finally {
    await pool.close();
  }
}

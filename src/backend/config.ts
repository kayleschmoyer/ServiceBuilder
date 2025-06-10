import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '5000', 10);

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const defaultDbConfig: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  user: process.env.DB_USER || '',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || '',
};

import express from 'express';
import morgan from 'morgan';
import tablesRoute from './routes/tables';
import exportRoute from './routes/export';
import connectRoute from './routes/connect';
import { PORT } from './config';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// ✅ Correct way to mount routers
app.use('/api/connect', connectRoute);
app.use('/api/tables', tablesRoute);
app.use('/api/export', exportRoute);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

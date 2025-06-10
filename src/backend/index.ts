import express from 'express';
import tablesRoute from './routes/tables'; // ✅ NOT .ts — just the route path
import exportRoute from './routes/export';

const app = express();
const PORT = 5000;

app.use(express.json());

// ✅ Correct way to mount routers
app.use('/api/tables', tablesRoute);
app.use('/api/export', exportRoute);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

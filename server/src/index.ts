import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { connectDB } from './db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import categoryBudgetRoutes from './routes/categoryBudgets.js';
import generalBudgetRoutes from './routes/generalBudgets.js';

const app = express();


app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/category-budgets', categoryBudgetRoutes);
app.use('/api/general-budgets', generalBudgetRoutes);


app.use(errorHandler);


async function start() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
    console.log(`Health check: http://localhost:${config.port}/api/health`);
  });
}

start();

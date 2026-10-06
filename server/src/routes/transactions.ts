import { Router, type Response } from 'express';
import { Transaction } from '../models/index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/transactions — get all transactions for the authenticated user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const transactions = await Transaction.find({ userId: req.user!._id }).sort({ timestamp: -1 });
  res.json(transactions);
});

// POST /api/transactions — create a new transaction
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await Transaction.create({
    ...req.body,
    userId: req.user!._id,
  });
  res.status(201).json(transaction);
});

// PUT /api/transactions/:id — update a transaction
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    { ...req.body, userId: req.user!._id },
    { new: true, runValidators: true }
  );

  if (!transaction) {
    res.status(404).json({ message: 'Transaction not found' });
    return;
  }

  res.json(transaction);
});

// DELETE /api/transactions/:id — delete a transaction
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!._id,
  });

  if (!transaction) {
    res.status(404).json({ message: 'Transaction not found' });
    return;
  }

  res.status(204).send();
});

export default router;

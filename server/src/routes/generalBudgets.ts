import { Router, type Response } from 'express';
import { GeneralBudget } from '../models/index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/general-budgets — get all general budgets for the authenticated user
// Supports ?month=YYYY-MM query parameter for filtering
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const filter: Record<string, any> = { userId: req.user!._id };

  if (req.query.month) {
    filter.month = req.query.month;
  }

  const budgets = await GeneralBudget.find(filter);

  // If month filter is provided, return single result or null (matches frontend expectation)
  if (req.query.month) {
    res.json(budgets[0] || null);
    return;
  }

  res.json(budgets);
});

// POST /api/general-budgets — create a new general budget
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const budget = await GeneralBudget.create({
    ...req.body,
    userId: req.user!._id,
  });
  res.status(201).json(budget);
});

// PUT /api/general-budgets/:id — update a general budget
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const budget = await GeneralBudget.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    { ...req.body, userId: req.user!._id },
    { new: true, runValidators: true }
  );

  if (!budget) {
    res.status(404).json({ message: 'General budget not found' });
    return;
  }

  res.json(budget);
});

// DELETE /api/general-budgets/:id — delete a general budget
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const budget = await GeneralBudget.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!._id,
  });

  if (!budget) {
    res.status(404).json({ message: 'General budget not found' });
    return;
  }

  res.status(204).send();
});

export default router;

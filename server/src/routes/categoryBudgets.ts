import { Router, type Response } from 'express';
import { CategoryBudget } from '../models/index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/category-budgets — get all category budgets for the authenticated user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const budgets = await CategoryBudget.find({ userId: req.user!._id });
  res.json(budgets);
});

// POST /api/category-budgets — create a new category budget
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const budget = await CategoryBudget.create({
    ...req.body,
    userId: req.user!._id,
  });
  res.status(201).json(budget);
});

// PUT /api/category-budgets/:id — update a category budget
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const budget = await CategoryBudget.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    { ...req.body, userId: req.user!._id },
    { new: true, runValidators: true }
  );

  if (!budget) {
    res.status(404).json({ message: 'Category budget not found' });
    return;
  }

  res.json(budget);
});

// DELETE /api/category-budgets/:id — delete a category budget
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const budget = await CategoryBudget.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!._id,
  });

  if (!budget) {
    res.status(404).json({ message: 'Category budget not found' });
    return;
  }

  res.status(204).send();
});

export default router;

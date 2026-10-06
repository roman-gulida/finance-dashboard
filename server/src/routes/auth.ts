import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { config } from '../config.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(409).json({ message: 'Account existed before registration. Please Sign in.' });
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  res.status(201).json({
    user: user.toJSON(),
    token,
  });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const user = await User.findOne({ username });
  if (!user) {
    res.status(401).json({ message: 'Account does not exist. Please check the data and try again.' });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: 'Incorrect password! Please check the password and try again.' });
    return;
  }

  const token = generateToken(user._id.toString());

  res.json({
    user: user.toJSON(),
    token,
  });
});

// GET /api/auth/me — verify token and return current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ user: req.user!.toJSON() });
});

export default router;

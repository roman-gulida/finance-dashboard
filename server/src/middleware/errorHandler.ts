import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({ message: 'Validation error', errors: messages });
    return;
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
    return;
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    res.status(409).json({ message: `${field} already exists` });
    return;
  }

  // Default to 500
  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
}

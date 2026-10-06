import mongoose, { Schema, type Document } from 'mongoose';
import type { ExpenseCategory } from './Transaction.js';

const expenseCategories: ExpenseCategory[] = [
  'groceries',
  'dining_out',
  'transportation',
  'rent_housing',
  'entertainment',
  'health_hygiene',
  'shopping',
];

export interface ICategoryBudget extends Document {
  userId: mongoose.Types.ObjectId;
  category: ExpenseCategory;
  limit: number;
  month: string; // Format: "YYYY-MM"
  createdAt: Date;
  updatedAt: Date;
}

const categoryBudgetSchema = new Schema<ICategoryBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: expenseCategories,
        message: '{VALUE} is not a valid expense category',
      },
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0, 'Budget limit cannot be negative'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Ensure one budget per category per month per user
categoryBudgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

export const CategoryBudget = mongoose.model<ICategoryBudget>(
  'CategoryBudget',
  categoryBudgetSchema
);

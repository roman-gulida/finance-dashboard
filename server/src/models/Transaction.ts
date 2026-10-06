import mongoose, { Schema, type Document } from 'mongoose';

export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 'salary' | 'freelance' | 'investments';
export type ExpenseCategory =
  | 'groceries'
  | 'dining_out'
  | 'transportation'
  | 'rent_housing'
  | 'entertainment'
  | 'health_hygiene'
  | 'shopping';
export type Category = IncomeCategory | ExpenseCategory;

const incomeCategories: IncomeCategory[] = ['salary', 'freelance', 'investments'];
const expenseCategories: ExpenseCategory[] = [
  'groceries',
  'dining_out',
  'transportation',
  'rent_housing',
  'entertainment',
  'health_hygiene',
  'shopping',
];
const allCategories: Category[] = [...incomeCategories, ...expenseCategories];

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  category: Category;
  description: string;
  amount: number;
  type: TransactionType;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
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
        values: allCategories,
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type',
      },
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      default: Date.now,
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

// Validate category matches transaction type
transactionSchema.pre('validate', function (next) {
  if (this.type === 'income' && !incomeCategories.includes(this.category as IncomeCategory)) {
    this.invalidate('category', `${this.category} is not a valid income category`);
  }
  if (this.type === 'expense' && !expenseCategories.includes(this.category as ExpenseCategory)) {
    this.invalidate('category', `${this.category} is not a valid expense category`);
  }
  next();
});

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

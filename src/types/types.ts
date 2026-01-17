import type { LucideIcon } from 'lucide-react';

/* AUTH TYPES */
export type User = {
  id: string;
  username: string;
  password: string;
};

export type UserCredentials = {
  username: string;
  password: string;
};

export type AuthContext = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  checkAuth: () => Promise<void>;
  register: (user: UserCredentials) => Promise<void>;
  login: (user: UserCredentials) => Promise<void>;
  logout: () => void;
};

/* TRANSACTION & CATEGORY TYPES */
export type TransactionType = 'income' | 'expense';

export const IncomeCategories = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investments', label: 'Investments' },
] as const;

export const ExpenseCategories = [
  { value: 'groceries', label: 'Groceries' },
  { value: 'dining_out', label: 'Dining out' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'rent_housing', label: 'Rent and Housing' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health_hygiene', label: 'Health and Hygiene' },
  { value: 'shopping', label: 'Shopping' },
] as const;

export const Categories = [...IncomeCategories, ...ExpenseCategories] as const;

type IncomeCategory = (typeof IncomeCategories)[number]['value'];

export type ExpenseCategory = (typeof ExpenseCategories)[number]['value'];

export type Category = IncomeCategory | ExpenseCategory;

type IncomeTransaction = {
  id: string;
  userId: string;
  category: IncomeCategory;
  description: string;
  amount: number;
  type: 'income';
  timestamp: string;
};

type ExpenseTransaction = {
  id: string;
  userId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  type: 'expense';
  timestamp: string;
};

export type Transaction = IncomeTransaction | ExpenseTransaction;

export type TxContext = {
  transactions: Transaction[];
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
  addTx: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  editTx: (tx: Transaction) => Promise<void>;
  removeTx: (txId: string) => Promise<void>;
};

export type Sort = 'dateNewest' | 'dateOldest' | 'amountAsc' | 'amountDesc' | 'category';

export type AmountRange = {
  min: string;
  max: string;
};

export type Filter = {
  type: TransactionType | null;
  categories: Category[];
  amountRange: AmountRange;
  month: string | null;
};

/* BUDGET TYPES */
export type CategoryBudget = {
  id: string;
  userId: string;
  category: ExpenseCategory;
  limit: number;
  month: string;
};

export type GeneralBudget = {
  id: string;
  userId: string;
  totalLimit: number;
  month: string;
};

export type BudgetContext = {
  categoryBudgets: CategoryBudget[];
  addCategoryBudget: (budget: Omit<CategoryBudget, 'id'>) => Promise<void>;
  editCategoryBudget: (budget: CategoryBudget) => Promise<void>;
  removeCategoryBudget: (budgetId: string) => Promise<void>;

  generalBudget: GeneralBudget | null;
  addGeneralBudget: (budget: Omit<GeneralBudget, 'id'>) => Promise<void>;
  editGeneralBudget: (budget: GeneralBudget) => Promise<void>;
  removeGeneralBudget: (budgetId: string) => Promise<void>;

  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;

  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
};

export type BudgetStatus = {
  color: 'green' | 'yellow' | 'red';
  Icon: LucideIcon;
  message: string;
};

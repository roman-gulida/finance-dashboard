import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
import {
  Categories,
  IncomeCategories,
  type BudgetStatus,
  type Category,
  type TransactionType,
} from '../types/types';

export const getCategoryLabel = (value: string) => {
  return Categories.find((c) => c.value === value)?.label ?? value;
};

export const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

export const getType = (c: Category): TransactionType => {
  return IncomeCategories.some((ic) => ic.value === c) ? 'income' : 'expense';
};

export const formatDateDay = (iso: string) => {
  return iso.slice(0, 10); // YYYY-MM-DD
};

export const toDatetimeLocal = (iso: string) => iso.slice(0, 16);

export const getBudgetStatus = (percentage: number): BudgetStatus => {
  if (percentage >= 100) return { color: 'red', Icon: CircleX, message: 'Over budget!' };
  if (percentage >= 90) return { color: 'red', Icon: CircleAlert, message: 'Almost exceeded!' };
  if (percentage >= 75) return { color: 'yellow', Icon: CircleAlert, message: 'Getting close' };
  return { color: 'green', Icon: CircleCheck, message: 'On track' };
};

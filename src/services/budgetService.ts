import type { CategoryBudget, GeneralBudget } from '../types/types';

const CATEGORY_BASE_URL = 'http://localhost:5000/categoryBudgets';
const GENERAL_BASE_URL = 'http://localhost:5000/generalBudgets';

// Category Budget
export const getCategoryBudgets = async (userId: string): Promise<CategoryBudget[]> => {
  const res = await fetch(`${CATEGORY_BASE_URL}?userId=${userId}`);
  if (!res.ok) {
    throw new Error('Failed to load category budget data. Please try again.');
  }
  const budgets = await res.json();
  if (!Array.isArray(budgets)) {
    throw new Error('Invalid category budgets respond');
  }
  return budgets;
};

export const createCategoryBudget = async (
  budget: Omit<CategoryBudget, 'id'>,
): Promise<CategoryBudget> => {
  const res = await fetch(`${CATEGORY_BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  });
  if (!res.ok) {
    throw new Error('Failed to add a category budget. Please try again.');
  }
  return res.json();
};

export const updateCategoryBudget = async (budget: CategoryBudget): Promise<CategoryBudget> => {
  const res = await fetch(`${CATEGORY_BASE_URL}/${budget.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  });

  if (!res.ok) {
    throw new Error('Failed to edit a category budget. Please try again.');
  }

  return res.json();
};

export const deleteCategoryBudget = async (budgetId: string): Promise<void> => {
  const res = await fetch(`${CATEGORY_BASE_URL}/${budgetId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete a category budget. Please try again.');
  }
};

// General Budget
export const getGeneralBudget = async (
  userId: string,
  month: string,
): Promise<GeneralBudget | null> => {
  const res = await fetch(`${GENERAL_BASE_URL}?userId=${userId}&month=${month}`);
  if (!res.ok) {
    throw new Error('Failed to load general budget data. Please try again.');
  }
  const budget = await res.json();
  if (!Array.isArray(budget)) return null;
  return budget[0] ?? null;
};

export const createGeneralBudget = async (
  budget: Omit<GeneralBudget, 'id'>,
): Promise<GeneralBudget> => {
  const res = await fetch(`${GENERAL_BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  });

  if (!res.ok) {
    throw new Error('Failed to add a general budget. Please try again.');
  }

  return res.json();
};

export const updateGeneralBudget = async (budget: GeneralBudget): Promise<GeneralBudget> => {
  const res = await fetch(`${GENERAL_BASE_URL}/${budget.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  });

  if (!res.ok) {
    throw new Error('Failed to update general budget. Please try again.');
  }

  return res.json();
};

export const deleteGeneralBudget = async (budgetId: string): Promise<void> => {
  const res = await fetch(`${GENERAL_BASE_URL}/${budgetId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete a general budget. Please try again.');
  }
};

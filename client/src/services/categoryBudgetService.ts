import { api } from '../lib/api';
import type { CategoryBudget } from '../types/types';

const BASE_ENDPOINT = '/api/category-budgets';

export const getCategoryBudgets = async (): Promise<CategoryBudget[]> => {
  const data = await api.get<CategoryBudget[]>(BASE_ENDPOINT);
  return data;
};

export const createCategoryBudget = async (
  budget: Omit<CategoryBudget, 'id' | 'userId'>,
): Promise<CategoryBudget> => {
  return api.post<CategoryBudget>(BASE_ENDPOINT, budget);
};

export const updateCategoryBudget = async (budget: CategoryBudget): Promise<CategoryBudget> => {
  return api.put<CategoryBudget>(`${BASE_ENDPOINT}/${budget.id}`, budget);
};

export const deleteCategoryBudget = async (budgetId: string): Promise<void> => {
  await api.delete(`${BASE_ENDPOINT}/${budgetId}`);
};

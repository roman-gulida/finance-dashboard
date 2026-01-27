import { api } from '../lib/api';
import type { CategoryBudget } from '../types/types';

const BASE_ENDPOINT = '/categoryBudgets';

export const getCategoryBudgets = async (userId: string): Promise<CategoryBudget[]> => {
  const data = await api.get<CategoryBudget[]>(BASE_ENDPOINT, { params: { userId } });
  return data;
};

export const createCategoryBudget = async (
  budget: Omit<CategoryBudget, 'id'>,
): Promise<CategoryBudget> => {
  return api.post<CategoryBudget>(BASE_ENDPOINT, budget);
};

export const updateCategoryBudget = async (budget: CategoryBudget): Promise<CategoryBudget> => {
  return api.put<CategoryBudget>(`${BASE_ENDPOINT}/${budget.id}`, budget);
};

export const deleteCategoryBudget = async (budgetId: string): Promise<void> => {
  await api.delete(`${BASE_ENDPOINT}/${budgetId}`);
};

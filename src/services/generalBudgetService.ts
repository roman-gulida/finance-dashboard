import { api } from '../lib/api';
import type { GeneralBudget } from '../types/types';

const BASE_ENDPOINT = '/generalBudgets';

export const getGeneralBudget = async (
  userId: string,
  month: string,
): Promise<GeneralBudget | null> => {
  const data = await api.get<GeneralBudget[]>(BASE_ENDPOINT, { params: { userId, month } });
  return data[0] || null;
};

export const createGeneralBudget = async (
  budget: Omit<GeneralBudget, 'id'>,
): Promise<GeneralBudget> => {
  return api.post<GeneralBudget>(BASE_ENDPOINT, budget);
};

export const updateGeneralBudget = async (budget: GeneralBudget): Promise<GeneralBudget> => {
  return api.put<GeneralBudget>(`${BASE_ENDPOINT}/${budget.id}`, budget);
};

export const deleteGeneralBudget = async (budgetId: string): Promise<void> => {
  await api.delete(`${BASE_ENDPOINT}/${budgetId}`);
};

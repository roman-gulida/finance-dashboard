import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCategoryBudget,
  deleteCategoryBudget,
  updateCategoryBudget,
} from '../../services/budgetService';
import type { CategoryBudget } from '../../types/types';
import createCategoryBudgetsQueryOptions from '../../queryOptions/categoryBudgetsQueryOptions';
import { useAuth } from '../../contexts/AuthContext';

export function useCategoryBudgetMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const addCategoryBudget = useMutation({
    mutationFn: (budget: Omit<CategoryBudget, 'id'>) => createCategoryBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createCategoryBudgetsQueryOptions(user!.id).queryKey,
      });
    },
  });

  const editCategoryBudget = useMutation({
    mutationFn: (budget: CategoryBudget) => updateCategoryBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createCategoryBudgetsQueryOptions(user!.id).queryKey,
      });
    },
  });

  const removeCategoryBudget = useMutation({
    mutationFn: (budgetId: string) => deleteCategoryBudget(budgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createCategoryBudgetsQueryOptions(user!.id).queryKey,
      });
    },
  });
  return { addCategoryBudget, editCategoryBudget, removeCategoryBudget };
}

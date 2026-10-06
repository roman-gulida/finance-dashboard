import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CategoryBudget } from '../../types/types';
import createCategoryBudgetsQueryOptions from '../../queryOptions/categoryBudgetsQueryOptions';
import {
  createCategoryBudget,
  deleteCategoryBudget,
  updateCategoryBudget,
} from '../../services/categoryBudgetService';

export function useCategoryBudgetMutations() {
  const queryClient = useQueryClient();
  const addCategoryBudget = useMutation({
    mutationFn: (budget: Omit<CategoryBudget, 'id'>) => createCategoryBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createCategoryBudgetsQueryOptions().queryKey,
      });
    },
  });

  const editCategoryBudget = useMutation({
    mutationFn: (budget: CategoryBudget) => updateCategoryBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createCategoryBudgetsQueryOptions().queryKey,
      });
    },
  });

  const removeCategoryBudget = useMutation({
    mutationFn: (budgetId: string) => deleteCategoryBudget(budgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createCategoryBudgetsQueryOptions().queryKey,
      });
    },
  });
  return { addCategoryBudget, editCategoryBudget, removeCategoryBudget };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createGeneralBudget,
  deleteGeneralBudget,
  updateGeneralBudget,
} from '../../services/generalBudgetService';
import type { GeneralBudget } from '../../types/types';
import createGeneralBudgetQueryOptions from '../../queryOptions/generalBudgetQueryOptions';
import { getCurrentMonth } from '../../utils/utils';

export function useGeneralBudgetMutations(month: string = getCurrentMonth()) {
  const queryClient = useQueryClient();
  const addGeneralBudget = useMutation({
    mutationFn: (budget: Omit<GeneralBudget, 'id'>) => createGeneralBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createGeneralBudgetQueryOptions(month).queryKey,
      });
    },
  });

  const editGeneralBudget = useMutation({
    mutationFn: (budget: GeneralBudget) => updateGeneralBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createGeneralBudgetQueryOptions(month).queryKey,
      });
    },
  });

  const removeGeneralBudget = useMutation({
    mutationFn: (budgetId: string) => deleteGeneralBudget(budgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createGeneralBudgetQueryOptions(month).queryKey,
      });
    },
  });
  return { addGeneralBudget, editGeneralBudget, removeGeneralBudget };
}

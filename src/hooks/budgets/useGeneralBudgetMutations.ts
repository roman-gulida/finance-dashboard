import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createGeneralBudget,
  deleteGeneralBudget,
  updateGeneralBudget,
} from '../../services/budgetService';
import type { GeneralBudget } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import createGeneralBudgetQueryOptions from '../../queryOptions/generalBudgetQueryOptions';
import { getCurrentMonth } from '../../utils/utils';

export function useGeneralBudgetMutations(month: string = getCurrentMonth()) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const addGeneralBudget = useMutation({
    mutationFn: (budget: Omit<GeneralBudget, 'id'>) => createGeneralBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createGeneralBudgetQueryOptions({ userId: user!.id, month }).queryKey,
      });
    },
  });

  const editGeneralBudget = useMutation({
    mutationFn: (budget: GeneralBudget) => updateGeneralBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createGeneralBudgetQueryOptions({ userId: user!.id, month }).queryKey,
      });
    },
  });

  const removeGeneralBudget = useMutation({
    mutationFn: (budgetId: string) => deleteGeneralBudget(budgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createGeneralBudgetQueryOptions({ userId: user!.id, month }).queryKey,
      });
    },
  });
  return { addGeneralBudget, editGeneralBudget, removeGeneralBudget };
}

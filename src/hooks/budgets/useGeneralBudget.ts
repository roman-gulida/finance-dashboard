import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import createGeneralBudgetQueryOptions from '../../queryOptions/generalBudgetQueryOptions';
import { getCurrentMonth } from '../../utils/utils';

export function useGeneralBudget(month: string = getCurrentMonth()) {
  const { user } = useAuth();
  return useQuery(createGeneralBudgetQueryOptions({ userId: user!.id, month }));
}

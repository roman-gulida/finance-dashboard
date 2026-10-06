import { useQuery } from '@tanstack/react-query';
import createGeneralBudgetQueryOptions from '../../queryOptions/generalBudgetQueryOptions';
import { getCurrentMonth } from '../../utils/utils';

export function useGeneralBudget(month: string = getCurrentMonth()) {
  return useQuery(createGeneralBudgetQueryOptions(month));
}

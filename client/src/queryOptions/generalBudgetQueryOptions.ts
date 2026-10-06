import { queryOptions } from '@tanstack/react-query';
import { getGeneralBudget } from '../services/generalBudgetService';

export default function createGeneralBudgetQueryOptions(month: string) {
  return queryOptions({
    queryKey: ['generalBudget', month],
    queryFn: () => getGeneralBudget(month),
  });
}

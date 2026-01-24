import { queryOptions } from '@tanstack/react-query';
import { getGeneralBudget } from '../services/budgetService';

type GeneralBudgetQueryProps = {
  userId: string;
  month: string;
};

export default function createGeneralBudgetQueryOptions({
  userId,
  month,
}: GeneralBudgetQueryProps) {
  return queryOptions({
    queryKey: ['generalBudget', userId, month],
    queryFn: () => getGeneralBudget(userId, month),
  });
}

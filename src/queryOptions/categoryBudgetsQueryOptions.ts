import { queryOptions } from '@tanstack/react-query';
import { getCategoryBudgets } from '../services/budgetService';

export default function createCategoryBudgetsQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['categoryBudgets', userId],
    queryFn: () => getCategoryBudgets(userId),
  });
}

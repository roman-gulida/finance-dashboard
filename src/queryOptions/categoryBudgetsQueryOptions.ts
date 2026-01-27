import { queryOptions } from '@tanstack/react-query';
import { getCategoryBudgets } from '../services/categoryBudgetService';

export default function createCategoryBudgetsQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['categoryBudgets', userId],
    queryFn: () => getCategoryBudgets(userId),
  });
}

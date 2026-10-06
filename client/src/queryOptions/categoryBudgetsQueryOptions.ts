import { queryOptions } from '@tanstack/react-query';
import { getCategoryBudgets } from '../services/categoryBudgetService';

export default function createCategoryBudgetsQueryOptions() {
  return queryOptions({
    queryKey: ['categoryBudgets'],
    queryFn: () => getCategoryBudgets(),
  });
}

import { useQuery } from '@tanstack/react-query';
import createCategoryBudgetsQueryOptions from '../../queryOptions/categoryBudgetsQueryOptions';

export function useCategoryBudgets() {
  return useQuery(createCategoryBudgetsQueryOptions());
}

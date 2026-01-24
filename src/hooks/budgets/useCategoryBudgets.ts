import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import createCategoryBudgetsQueryOptions from '../../queryOptions/categoryBudgetsQueryOptions';

export function useCategoryBudgets() {
  const { user } = useAuth();
  return useQuery(createCategoryBudgetsQueryOptions(user!.id));
}

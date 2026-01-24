import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import createTransactionsQueryOptions from '../../queryOptions/transactionsQueryOptions';

export function useTransactions() {
  const { user } = useAuth();
  return useSuspenseQuery(createTransactionsQueryOptions(user!.id));
}

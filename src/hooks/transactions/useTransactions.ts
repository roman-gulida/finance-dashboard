import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import createTransactionsQueryOptions from '../../queryOptions/transactionsQueryOptions';

export function useTransactions() {
  const { user } = useAuth();
  return useQuery(createTransactionsQueryOptions(user!.id));
}

import { useSuspenseQuery } from '@tanstack/react-query';
import createTransactionsQueryOptions from '../../queryOptions/transactionsQueryOptions';

export function useTransactions() {
  return useSuspenseQuery(createTransactionsQueryOptions());
}

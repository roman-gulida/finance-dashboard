import { queryOptions } from '@tanstack/react-query';
import { getTxs } from '../services/txService';

export default function createTransactionsQueryOptions(userId: string) {
  return queryOptions({
    queryKey: ['transactions', userId],
    queryFn: () => getTxs(userId),
  });
}

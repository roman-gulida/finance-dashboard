import { queryOptions } from '@tanstack/react-query';
import { getTxs } from '../services/txService';

export default function createTransactionsQueryOptions() {
  return queryOptions({
    queryKey: ['transactions'],
    queryFn: () => getTxs(),
  });
}

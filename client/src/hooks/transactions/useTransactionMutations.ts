import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTx, deleteTx, updateTx } from '../../services/txService';
import type { Transaction } from '../../types/types';
import createTransactionsQueryOptions from '../../queryOptions/transactionsQueryOptions';

export function useTransactionMutations() {
  const queryClient = useQueryClient();
  const addTransaction = useMutation({
    mutationFn: (tx: Omit<Transaction, 'id'>) => createTx(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createTransactionsQueryOptions().queryKey,
      });
    },
  });

  const editTransaction = useMutation({
    mutationFn: (tx: Transaction) => updateTx(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createTransactionsQueryOptions().queryKey,
      });
    },
  });

  const removeTransaction = useMutation({
    mutationFn: (txId: string) => deleteTx(txId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createTransactionsQueryOptions().queryKey,
      });
    },
  });

  return { addTransaction, editTransaction, removeTransaction };
}

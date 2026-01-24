import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTx, deleteTx, updateTx } from '../../services/txService';
import type { Transaction } from '../../types/types';
import createTransactionsQueryOptions from '../../queryOptions/transactionsQueryOptions';
import { useAuth } from '../../contexts/AuthContext';

export function useTransactionMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const addTransactoin = useMutation({
    mutationFn: (tx: Transaction) => createTx(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createTransactionsQueryOptions(user!.id).queryKey,
      });
    },
  });

  const editTransaction = useMutation({
    mutationFn: (tx: Transaction) => updateTx(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createTransactionsQueryOptions(user!.id).queryKey,
      });
    },
  });

  const removeTransaction = useMutation({
    mutationFn: (txId: string) => deleteTx(txId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createTransactionsQueryOptions(user!.id).queryKey,
      });
    },
  });

  return { addTransactoin, editTransaction, removeTransaction };
}

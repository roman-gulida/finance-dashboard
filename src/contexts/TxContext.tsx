import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { type Transaction, type TxContext } from '../types/types';
import { createTx, updateTx, deleteTx, getTxs } from '../services/txService';
import { useAuth } from './AuthContext';

type TxProviderProps = {
  children: ReactNode;
};

const TxContext = createContext<TxContext | undefined>(undefined);

export function TransactionsProvider({ children }: TxProviderProps) {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTxs = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const txs = await getTxs(user.id);
      setTransactions(txs ?? []);
    } catch (err) {
      setError(new Error('Failed to load transactions'));
      console.error('Failed to load transactions', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTxs();
  }, [fetchTxs]);

  const addTx = async (tx: Omit<Transaction, 'id'>): Promise<void> => {
    setIsLoading(true);

    try {
      const newTx: Transaction = await createTx(tx);
      setTransactions((prev) => [...prev, newTx]);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editTx = async (tx: Transaction): Promise<void> => {
    setIsLoading(true);

    try {
      const updatedTx = await updateTx(tx);
      setTransactions((prev) =>
        prev.map((transaction) => (transaction.id === updatedTx.id ? updatedTx : transaction)),
      );
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeTx = async (txId: string): Promise<void> => {
    setIsLoading(true);

    try {
      await deleteTx(txId);
      setTransactions((prev) => prev.filter((tx) => tx.id !== txId));
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: TxContext = {
    transactions,
    error,
    isLoading,
    refetch: fetchTxs,
    addTx,
    editTx,
    removeTx,
  };

  return <TxContext.Provider value={value}>{children}</TxContext.Provider>;
}

export const useTransactions = () => {
  const context = useContext(TxContext);

  if (!context) {
    throw new Error('useTransactions() context should be used within TransactionsProvider');
  }
  return context;
};

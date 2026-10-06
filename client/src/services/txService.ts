import { api } from '../lib/api';
import type { Transaction } from '../types/types';

const BASE_ENDPOINT = '/api/transactions';

export const getTxs = async (): Promise<Transaction[]> => {
  const data = await api.get<Transaction[]>(BASE_ENDPOINT);
  return data;
};

export const createTx = async (tx: Omit<Transaction, 'id' | 'userId'>): Promise<Transaction> => {
  return api.post<Transaction>(BASE_ENDPOINT, tx);
};

export const updateTx = async (tx: Transaction): Promise<Transaction> => {
  return api.put<Transaction>(`${BASE_ENDPOINT}/${tx.id}`, tx);
};

export const deleteTx = async (txId: string): Promise<void> => {
  await api.delete(`${BASE_ENDPOINT}/${txId}`);
};

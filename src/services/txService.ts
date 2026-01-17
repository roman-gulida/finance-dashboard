import type { Transaction } from '../types/types';

const BASE_URL = 'http://localhost:5000/transactions';

export const getTxs = async (userId: string): Promise<Transaction[]> => {
  const res = await fetch(`${BASE_URL}?userId=${userId}`);
  if (!res.ok) {
    throw new Error('Failed to load transactions. Please try again.');
  }
  const txs = await res.json();
  if (!Array.isArray(txs)) {
    throw new Error('Invalid transactions respond');
  }
  return txs;
};

export const createTx = async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const res = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx),
  });
  if (!res.ok) {
    throw new Error('Failed to add transaction. Please try again.');
  }
  return res.json();
};

export const updateTx = async (tx: Transaction): Promise<Transaction> => {
  const res = await fetch(`${BASE_URL}/${tx.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx),
  });
  if (!res.ok) {
    throw new Error('Failed to update transaction. Please try again.');
  }
  return res.json();
};

export const deleteTx = async (txId: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${txId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete transaction. Please try again.');
  }
};

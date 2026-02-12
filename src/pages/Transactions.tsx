import TxCard from '../components/transactions/TxCard';
import { useMemo, useState } from 'react';
import { type Filter, type Sort, type Transaction } from '../types/types';
import TxModal from '../components/transactions/TxModal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import TxFilter from '../components/transactions/TxFilter';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import { Frown } from 'lucide-react';
import { useTransactions } from '../hooks/transactions/useTransactions';
import { useTransactionMutations } from '../hooks/transactions/useTransactionMutations';
import TxSearch from '../components/transactions/TxSearch';
import TxSort from '../components/transactions/TxSort';

function Transactions() {
  const {
    addTransaction: { mutate: addTx },
    editTransaction: { mutate: editTx },
    removeTransaction: { mutate: removeTx },
  } = useTransactionMutations();
  const { data: transactions = [], refetch, isPending, error } = useTransactions();

  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editedTx, setEditedTx] = useState<Transaction | undefined>(undefined);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sort, setSort] = useState<Sort>('category');
  const [filter, setFilter] = useState<Filter>({
    type: null,
    categories: [],
    amountRange: { min: '', max: '' },
    month: null,
  });

  const txs = useMemo(() => {
    const filteredTransactions = transactions.filter((tx) => {
      const searchMatches = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
      const typeFilter = !filter.type || filter.type === tx.type;
      const categoriesFilter =
        filter.categories.length === 0 || filter.categories.includes(tx.category);
      const amountFilter =
        (filter.amountRange.min === '' ? true : tx.amount >= Number(filter.amountRange.min)) &&
        (filter.amountRange.max === '' ? true : tx.amount <= Number(filter.amountRange.max));
      const monthFilter = !filter.month || tx.timestamp.startsWith(filter.month);

      return searchMatches && typeFilter && categoriesFilter && amountFilter && monthFilter;
    });

    const sortTransactions = (transactions: Transaction[]): Transaction[] => {
      const sorted = [...transactions];

      const sortFunctions: Record<Sort, (a: Transaction, b: Transaction) => number> = {
        dateNewest: (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        dateOldest: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        amountAsc: (a, b) => a.amount - b.amount,
        amountDesc: (a, b) => b.amount - a.amount,
        category: (a, b) => a.category.localeCompare(b.category),
      };

      return sorted.sort(sortFunctions[sort]);
    };

    return sortTransactions(filteredTransactions);
  }, [transactions, filter, sort, searchQuery]);

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  const userId = user!.id;

  const handleSubmit = (data: Transaction) => {
    editedTx
      ? editTx(
          {
            ...data,
            id: editedTx.id,
            userId,
          },
          {
            onSuccess: () => {
              toast.success('Transaction edited successfully');
            },
            onError: () => {
              toast.error('Failed to edit a transaction');
            },
            onSettled: () => {
              setIsOpen(false);
              setEditedTx(undefined);
            },
          },
        )
      : addTx(
          { ...data, userId },
          {
            onSuccess: () => {
              toast.success('Transaction added successfully');
            },
            onError: () => {
              toast.error('Failed to add a transaction');
            },
            onSettled: () => {
              setIsOpen(false);
              setEditedTx(undefined);
            },
          },
        );
  };

  const handleEdit = (tx: Transaction) => {
    setEditedTx(tx);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditedTx(undefined);
    setIsOpen(true);
  };

  const handleRemove = (txId: string) => {
    removeTx(txId, {
      onSuccess: () => toast.success('Transaction deleted successfully'),
      onError: () => toast.error('Failed to delete a transaction'),
    });
  };

  return (
    <>
      <div className="flex min-h-screen">
        <aside className="w-70 border-r-3 border-primary-300 dark:border-primary-700">
          <div className="sticky top-5 p-6">
            <TxFilter filter={filter} setFilter={setFilter} />
          </div>
        </aside>

        <main className="flex-1">
          <div className="sticky top-5 z-10 mx-8">
            <div className="flex items-center justify-between px-8 py-4 border-2 rounded-4xl bg-primary-100 dark:bg-primary-900 border-primary-300 dark:border-primary-700 shadow-md transition-colors duration-200 ease-out">
              <button onClick={handleAdd} className="h-11 primary-btn px-3 py-2">
                Add Transaction
              </button>
              <TxSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <TxSort sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className="p-8">
            {isPending ? (
              <Loading />
            ) : txs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-40">
                <Frown size={64} className="mb-2 text-primary-400" />
                <p className="text-lg text-primary-400">
                  No transactions to display. Try adjusting your filters or add a new transaction.
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 xl:grid-cols-5 gap-y-5">
                {txs.map((tx) => (
                  <li key={tx.id}>
                    <TxCard tx={tx} handleEdit={handleEdit} handleRemove={handleRemove} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>

      <TxModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editedTx}
      />
    </>
  );
}

export default Transactions;

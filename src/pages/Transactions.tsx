import TxCard from '../components/transactions/TxCard';
import { useMemo, useState } from 'react';
import { type Filter, type Sort, type Transaction } from '../types/types';
import TxModal from '../components/transactions/TxModal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import TxFilter from '../components/transactions/TxFilter';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import { Frown, SlidersHorizontal } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState<boolean>(false); // Mobile filter toggle

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
          { ...data, id: editedTx.id, userId },
          {
            onSuccess: () => toast.success('Transaction edited successfully'),
            onError: () => toast.error('Failed to edit a transaction'),
            onSettled: () => {
              setIsOpen(false);
              setEditedTx(undefined);
            },
          },
        )
      : addTx(
          { ...data, userId },
          {
            onSuccess: () => toast.success('Transaction added successfully'),
            onError: () => toast.error('Failed to add a transaction'),
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
      <div className="flex flex-col lg:flex-row min-h-screen">
        <aside className="hidden lg:block w-70 border-r-3 border-primary-300 dark:border-primary-700">
          <div className="sticky top-5 p-4">
            <TxFilter filter={filter} setFilter={setFilter} />
          </div>
        </aside>

        {showFilters && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-primary-50 dark:bg-primary-950 border-r-2 border-primary-300 dark:border-primary-700 overflow-y-auto">
              <div className="p-4">
                <TxFilter filter={filter} setFilter={setFilter} />
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-4 px-4 py-3 primary-btn font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          <div className="sticky top-5 z-10 mx-4 sm:mx-2 lg:mx-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-1 sm:max-md:gap-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-2 rounded-2xl sm:rounded-4xl bg-primary-100 dark:bg-primary-900 border-primary-300 dark:border-primary-700 shadow-md">
              <div className="flex sm:hidden gap-2">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex-1 h-11 flex items-center justify-center gap-2 primary-btn px-3 py-2 text-sm font-semibold"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 h-11 primary-btn px-3 py-2 text-sm font-semibold"
                >
                  Add
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="hidden sm:block h-11 primary-btn px-4 py-2 font-semibold whitespace-nowrap"
              >
                Add Transaction
              </button>

              <div className="flex-1 sm:flex-initial sm:min-w-62.5 lg:min-w-75">
                <TxSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>

              <TxSort sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {isPending ? (
              <Loading />
            ) : txs.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 sm:py-40 px-4">
                <Frown size={64} className="mb-2 text-primary-400" />
                <p className="text-sm sm:text-lg text-primary-400 max-w-md">
                  No transactions to display. Try adjusting your filters or add a new transaction.
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
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

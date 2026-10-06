import { Link } from 'react-router-dom';
import type { Transaction } from '../../types/types';
import { getCategoryLabel } from '../../utils/utils';
import ErrorDisplay from '../ErrorDisplay';
import Loading from '../Loading';
import { Frown, MoveRight } from 'lucide-react';
import { CenteredState } from '../CenteredState';

type RecentTxsProps = {
  fiveLastTxs: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

function RecentTxs({ fiveLastTxs, isLoading, error, refetch }: RecentTxsProps) {
  if (isLoading)
    return (
      <CenteredState>
        <Loading />
      </CenteredState>
    );
  if (error)
    return (
      <CenteredState>
        <ErrorDisplay error={error} onRetry={refetch} />
      </CenteredState>
    );

  return (
    <div className="h-full card-surface p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex justify-center">Recent Transactions</h2>

      {fiveLastTxs.length > 0 ? (
        <>
          <ul className="flex-1 space-y-3">
            {fiveLastTxs.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-950 rounded-xl"
              >
                <span className="text-sm font-medium text-highlight">
                  {getCategoryLabel(tx.category)}
                </span>
                <span
                  className={`text-sm font-bold ${
                    tx.type === 'income'
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to="/transactions"
            className="mt-2 text-center py-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <span className="flex items-center gap-1 justify-center font-semibold text-base">
              View all <MoveRight size={16} />
            </span>
          </Link>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Frown size={56} className="mb-3 text-primary-400" />
          <p className="text-lg text-primary-400 mb-4">You don't have any transactions yet.</p>
          <Link to="/transactions" className="px-4 py-2 primary-btn text-sm font-semibold">
            Add a transaction
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecentTxs;

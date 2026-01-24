import { Link } from 'react-router-dom';
import type { Transaction } from '../../types/types';
import { getCategoryLabel } from '../../utils/utils';
import ErrorDisplay from '../ErrorDisplay';
import Loading from '../Loading';
import { Frown } from 'lucide-react';

type RecentTxsProps = {
  fiveLastTxs: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

function RecentTxs({ fiveLastTxs, isLoading, error, refetch }: RecentTxsProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div className="recent-txs">
      <h2>Recent Transactions</h2>
      {fiveLastTxs.length > 0 ? (
        <>
          <ul>
            {fiveLastTxs.map((tx) => (
              <li key={tx.id}>
                <span>{getCategoryLabel(tx.category)}</span>{' '}
                <span>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount}
                </span>
              </li>
            ))}
          </ul>

          <Link to="/transactions">View all</Link>
        </>
      ) : (
        <>
          <Frown />
          <p>You don't have any transactions yet.</p>
          <Link to="/transactions">Add a transaction</Link>
        </>
      )}
    </div>
  );
}

export default RecentTxs;

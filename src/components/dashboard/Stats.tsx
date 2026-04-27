import { CenteredState } from '../CenteredState';
import ErrorDisplay from '../ErrorDisplay';
import Loading from '../Loading';
import StatCard from './StatCard';

type StatsProps = {
  totalIncome: number;
  totalSpent: number;
  budgetStats: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

function Stats({ totalIncome, totalSpent, budgetStats, isLoading, error, refetch }: StatsProps) {
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
    <div className="grid justify-items-center grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <StatCard
        title="Income"
        value={`+$${totalIncome.toFixed(2)}`}
        subtext={totalIncome === 0 ? 'no income this month' : 'this month'}
      />
      <StatCard
        title="Budget"
        value={budgetStats ? `${budgetStats.toFixed(0)}%` : 'Not set'}
        subtext={budgetStats ? 'used' : 'set a budget'}
      />
      <StatCard
        title="Expenses"
        value={`-$${totalSpent.toFixed(2)}`}
        subtext={totalSpent === 0 ? 'no expenses this month' : 'this month'}
      />
    </div>
  );
}

export default Stats;

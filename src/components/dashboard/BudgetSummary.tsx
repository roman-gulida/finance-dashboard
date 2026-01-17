import { Link } from 'react-router-dom';
import type { CategoryBudget, GeneralBudget } from '../../types/types';
import ErrorDisplay from '../ErrorDisplay';
import Loading from '../Loading';
import ProgressBar from '../ProgressBar';
import { getCategoryLabel } from '../../utils/utils';

type BudgetSummaryProps = {
  generalBudget: GeneralBudget | null;
  categoryBudgets: CategoryBudget[];
  spentByCategory: Record<string, number>;
  totalSpent: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

function BudgetSummary({
  generalBudget,
  categoryBudgets: monthCategoryBudgets,
  spentByCategory,
  totalSpent,
  isLoading,
  error,
  refetch,
}: BudgetSummaryProps) {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div className="budget-summary">
      <h2>Budget progress this month</h2>
      {generalBudget ? (
        <div className="general-budget-summary">
          <span>
            Overall: ${totalSpent} / ${generalBudget.totalLimit}
          </span>
          <ProgressBar percentage={(totalSpent / generalBudget.totalLimit) * 100} />
        </div>
      ) : (
        <div className="general-budget-summary">
          <h3>Overall Budget Progress</h3>
          <p>No overall budget set for this month</p>
          <Link to="/budget">Set General Budget</Link>
        </div>
      )}

      {monthCategoryBudgets.length > 0 ? (
        <div className="category-budget-summary">
          <span>Categories:</span>
          <ul>
            {monthCategoryBudgets.slice(0, 3).map((cb) => {
              const percentage = ((spentByCategory[cb.category] ?? 0) / cb.limit) * 100;

              return (
                <li key={cb.id}>
                  <span>
                    {getCategoryLabel(cb.category)}: <ProgressBar percentage={percentage} />
                    <span>
                      ${spentByCategory[cb.category] ?? 0} / ${cb.limit}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="category-budget-summary">
          <h3>Category Budget Progress</h3>
          <p>No category budget set for this month</p>
          <Link to="/budget">Set Category Budget</Link>
        </div>
      )}

      <Link to="/budget">View Full Budget</Link>
    </div>
  );
}

export default BudgetSummary;

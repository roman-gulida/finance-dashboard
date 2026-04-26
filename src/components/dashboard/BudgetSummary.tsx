import { Link } from 'react-router-dom';
import type { CategoryBudget, GeneralBudget } from '../../types/types';
import ErrorDisplay from '../ErrorDisplay';
import Loading from '../Loading';
import ProgressBar from '../ProgressBar';
import { getCategoryLabel } from '../../utils/utils';
import { MoveRight } from 'lucide-react';

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
  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;

  const displayedCategories = monthCategoryBudgets.slice(0, 2);
  const isSingleCategory = displayedCategories.length === 1;

  return (
    <div className="h-full card-surface p-4 sm:p-6 flex flex-col">
      <h2 className="text-lg sm:text-xl font-bold mb-2 text-center">Budget Progress</h2>

      <div className="mb-2 p-4 bg-primary-50 dark:bg-primary-950 rounded-xl">
        {generalBudget ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall</span>
              <span className="text-sm font-semibold">
                ${totalSpent.toFixed(2)} / ${generalBudget.totalLimit.toFixed(2)}
              </span>
            </div>
            <ProgressBar percentage={(totalSpent / generalBudget.totalLimit) * 100} />
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
              No overall budget set
            </p>
            <Link
              to="/budget"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Set Budget
              <MoveRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {displayedCategories.length > 0 ? (
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-center">Categories</h3>

          <div className={`grid gap-3 ${isSingleCategory ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {displayedCategories.map((cb) => {
              const spent = spentByCategory[cb.category] ?? 0;
              const percentage = (spent / cb.limit) * 100;

              return (
                <div key={cb.id} className="p-3 bg-primary-50 dark:bg-primary-950 rounded-xl">
                  <div className="flex flex-col mb-2">
                    <span className="text-sm font-medium mb-1">
                      {getCategoryLabel(cb.category)}
                    </span>
                    <span className="text-xs text-highlight">
                      ${spent.toFixed(2)} / ${cb.limit.toFixed(2)}
                    </span>
                  </div>
                  <ProgressBar percentage={percentage} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
            No category budgets set
          </p>
          <Link
            to="/budget"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Set Budgets
            <MoveRight size={14} />
          </Link>
        </div>
      )}

      <Link
        to="/budget"
        className="mt-2 text-center py-2 inline-flex items-center justify-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
      >
        View Full Budget
        <MoveRight size={14} />
      </Link>
    </div>
  );
}

export default BudgetSummary;

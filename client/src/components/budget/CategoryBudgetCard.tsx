import { SquarePen, Trash } from 'lucide-react';
import { type CategoryBudget } from '../../types/types';
import { getBudgetStatus, getCategoryLabel } from '../../utils/utils';
import ProgressBar from '../ProgressBar';

type CategoryBudgetCardProps = {
  budget: CategoryBudget;
  spentByCategory: number;
  handleEdit: (budget: CategoryBudget) => void;
  handleRemove: (budgetId: string) => void;
};

function CategoryBudgetCard({
  budget,
  spentByCategory,
  handleEdit,
  handleRemove,
}: CategoryBudgetCardProps) {
  const percentage = (spentByCategory / budget.limit) * 100;
  const status = getBudgetStatus(percentage);
  const remaining = budget.limit - spentByCategory;

  const colorClasses = {
    green: 'text-green-600 dark:text-green-500',
    yellow: 'text-yellow-600 dark:text-yellow-500',
    red: 'text-red-600 dark:text-red-500',
  };

  return (
    <div className="p-3 sm:p-4 flex flex-col items-center card-surface card-interactive">
      <h3 className="text-lg sm:text-xl text-center mb-2 sm:mb-3">
        {getCategoryLabel(budget.category)}
      </h3>

      <div className="w-full mb-2 px-2">
        <p className="text-xs sm:text-sm text-highlight mb-2 text-center">
          ${spentByCategory.toFixed(2)} / ${budget.limit.toFixed(2)}
        </p>
        <ProgressBar percentage={percentage} />
      </div>

      <div className="flex items-center justify-center gap-2 mb-2 text-xs sm:text-sm">
        <status.Icon size={18} className={colorClasses[status.color]} />
        <span>{status.message}</span>
      </div>

      <p className="text-center text-xs sm:text-sm text-highlight mb-3">
        {remaining < 0 ? 'Over by' : 'Remaining'}: ${Math.abs(remaining).toFixed(2)}
      </p>

      <div className="flex w-full justify-center items-center gap-2">
        <button
          onClick={() => handleEdit(budget)}
          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 p-2 bg-primary-400 hover:bg-primary-500 dark:bg-primary-600 rounded-2xl transition-colors font-semibold text-xs sm:text-sm"
        >
          <SquarePen size={16} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => handleRemove(budget.id)}
          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 p-2 bg-red-500/90 hover:bg-red-600 dark:bg-red-600/80 rounded-2xl transition-colors text-xs sm:text-sm"
        >
          <Trash size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default CategoryBudgetCard;

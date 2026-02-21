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
    <div className="p-4 flex flex-col items-center bg-primary-100 dark:bg-primary-900 border-2 border-primary-300 dark:border-primary-700 rounded-2xl hover:shadow-lg hover:-translate-y-1 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-200">
      <h3 className="text-xl text-center">{getCategoryLabel(budget.category)}</h3>

      <div className="my-3 flex flex-col items-center gap-2">
        <p className="text-sm text-highlight">
          ${spentByCategory.toFixed(2)} / ${budget.limit.toFixed(2)}
        </p>
        <ProgressBar percentage={percentage} />
      </div>

      <div className="flex items-center justify-center gap-2 mb-1 text-sm">
        <status.Icon size={18} className={colorClasses[status.color]} />
        <span>{status.message}</span>
      </div>

      <p className="text-center text-sm text-highlight">
        {remaining < 0 ? 'Over by' : 'Remaining'}: ${Math.abs(remaining).toFixed(2)}
      </p>

      <div className="p-2 flex justify-center items-center gap-8">
        <button onClick={() => handleEdit(budget)} className="p-2 flex-1 icon-btn">
          <span>
            <SquarePen size={22} />
          </span>
        </button>
        <button
          onClick={() => handleRemove(budget.id)}
          className="p-2 flex-1 hover:bg-red-600/80 dark:hover:bg-red-500/90 icon-btn"
        >
          <span>
            <Trash size={22} />
          </span>
        </button>
      </div>
    </div>
  );
}

export default CategoryBudgetCard;

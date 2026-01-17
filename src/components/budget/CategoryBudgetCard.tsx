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

  return (
    <div className="budget-card">
      <span>
        <h3>{getCategoryLabel(budget.category)} Budget</h3>
        <span>
          ${spentByCategory} / ${budget.limit}
        </span>
      </span>

      <ProgressBar percentage={percentage} />

      <span className="status">
        <status.Icon size={16} />
        {status.message}
        {' - '}
        {remaining < 0 ? 'Over by' : 'Remaining'}: ${Math.abs(remaining).toFixed(2)}
      </span>

      <div>
        <button onClick={() => handleEdit(budget)}>
          <span>
            <SquarePen size={16} /> {'Edit'}
          </span>
        </button>
        <button onClick={() => handleRemove(budget.id)}>
          <span>
            <Trash size={16} /> {'Delete'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default CategoryBudgetCard;

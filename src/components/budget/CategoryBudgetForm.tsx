import { useForm } from 'react-hook-form';
import { ExpenseCategories, type CategoryBudget, type ExpenseCategory } from '../../types/types';

type CategoryBudgetFormProps = {
  initialValues: CategoryBudget | undefined;
  availableCategories: ExpenseCategory[];
  month: string;
  onSubmit: (data: CategoryBudget) => void;
  onClose: () => void;
};

function CategoryBudgetForm({
  initialValues,
  availableCategories,
  month,
  onSubmit,
  onClose,
}: CategoryBudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryBudget>({
    defaultValues: initialValues ?? {
      category: availableCategories[0],
      limit: undefined,
      month,
    },
  });

  const categories = initialValues
    ? ExpenseCategories
    : ExpenseCategories.filter((c) => availableCategories.includes(c.value));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Category</label>
        <select
          {...register('category', { required: true })}
          className="w-full px-4 py-3 form-input cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Budget Limit ($)</label>
        <input
          type="number"
          step="0.01"
          {...register('limit', {
            required: 'Budget limit is required',
            min: { value: 0.01, message: 'Must be greater than 0' },
            valueAsNumber: true,
          })}
          className="w-full px-4 py-3 form-input"
          placeholder="500.00"
        />
        {errors.limit && (
          <span className="text-red-600 dark:text-red-400 text-sm mt-1 block">
            {errors.limit.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Month</label>
        <div className="px-4 py-3 bg-primary-100 dark:bg-primary-900 rounded-2xl border-2 border-primary-300 dark:border-primary-700">
          <span className="font-medium">{month}</span>
        </div>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
          Month is set automatically
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-primary-200 dark:bg-primary-800 hover:bg-primary-300 dark:hover:bg-primary-700 rounded-2xl font-semibold transition-colors"
        >
          Cancel
        </button>
        <button type="submit" className="flex-1 px-4 py-3 primary-btn font-semibold">
          {initialValues ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}

export default CategoryBudgetForm;

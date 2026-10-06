import { useForm } from 'react-hook-form';
import type { GeneralBudget } from '../../types/types';

type GeneralBudgetFormProps = {
  initialValues: GeneralBudget | undefined;
  month: string;
  onSubmit: (data: Omit<GeneralBudget, 'id'>) => void;
  onClose: () => void;
};

function GeneralBudgetForm({ initialValues, month, onSubmit, onClose }: GeneralBudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<GeneralBudget, 'id'>>({
    defaultValues: initialValues || {
      month,
      totalLimit: undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Month</label>
        <div className="px-4 py-3 bg-primary-100 dark:bg-primary-900 rounded-2xl border-2 border-primary-300 dark:border-primary-700">
          <span className="font-medium">{month}</span>
        </div>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
          Month is set automatically
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Total Budget Limit ($)</label>
        <input
          type="number"
          step="0.01"
          {...register('totalLimit', {
            required: 'Budget limit is required',
            min: { value: 0.01, message: 'Budget must be greater than 0' },
            valueAsNumber: true,
          })}
          className="w-full px-4 py-3 form-input"
          placeholder="2000.00"
        />
        {errors.totalLimit && (
          <span className="text-red-600 dark:text-red-400 text-sm mt-1 block">
            {errors.totalLimit.message}
          </span>
        )}
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
          {initialValues ? 'Update' : 'Set'} Budget
        </button>
      </div>
    </form>
  );
}

export default GeneralBudgetForm;

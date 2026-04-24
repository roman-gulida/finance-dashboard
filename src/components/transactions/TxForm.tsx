import { useForm } from 'react-hook-form';
import {
  Categories,
  ExpenseCategories,
  IncomeCategories,
  type Transaction,
} from '../../types/types';
import { toDatetimeLocal } from '../../utils/utils';

type TxFormProps = {
  initialValues: Transaction | undefined;
  onSubmit: (data: Transaction) => void;
  onClose: () => void;
};

function TxForm({ initialValues, onSubmit, onClose }: TxFormProps) {
  const now = new Date().toISOString().slice(0, 16);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Transaction>({
    defaultValues: initialValues
      ? { ...initialValues, timestamp: toDatetimeLocal(initialValues.timestamp) }
      : {
          type: 'expense',
          category: Categories[3].value,
          description: '',
          amount: undefined,
          timestamp: now,
        },
  });

  const submitForm = (data: Transaction) => {
    const finalData = {
      ...data,
      timestamp: new Date(data.timestamp).toISOString(),
    };
    onSubmit(finalData);
  };

  const type = watch('type');
  const availableCategories = type === 'income' ? IncomeCategories : ExpenseCategories;

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-2">
      <div>
        <label className="block text-sm font-semibold mb-2">Type</label>
        <select
          {...register('type', { required: true })}
          className="w-full px-4 py-3 form-input cursor-pointer"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Category</label>
        <select
          {...register('category', { required: true })}
          className="w-full px-4 py-3 form-input cursor-pointer"
        >
          {availableCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <input
          type="text"
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 3, message: 'Description should have at least 3 characters' },
          })}
          className="w-full px-4 py-3 form-input"
          placeholder="Grocery shopping"
        />
        {errors.description && (
          <span className="text-red-600 dark:text-red-400 text-sm mt-1 block">
            {errors.description.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Amount ($)</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
            valueAsNumber: true,
          })}
          className="w-full px-4 py-3 form-input"
          placeholder="0.00"
        />
        {errors.amount && (
          <span className="text-red-600 dark:text-red-400 text-sm mt-1 block">
            {errors.amount.message}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Date & Time</label>
        <input
          type="datetime-local"
          {...register('timestamp', {
            required: 'Date is required',
            max: { value: now, message: 'Date cannot be in the future' },
          })}
          className="w-full px-4 py-3 form-input"
        />
        {errors.timestamp && (
          <span className="text-red-600 dark:text-red-400 text-sm mt-1 block">
            {errors.timestamp.message}
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
          {initialValues ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}

export default TxForm;

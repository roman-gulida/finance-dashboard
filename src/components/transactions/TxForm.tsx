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
};

function TxForm({ initialValues, onSubmit }: TxFormProps) {
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
    <form onSubmit={handleSubmit(submitForm)}>
      <div>
        <label>Type</label>
        <select {...register('type', { required: true })}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label>Category</label>
        <select {...register('category', { required: true })}>
          {availableCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Description</label>
        <input
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 3, message: 'Description should have at least 3 characters' },
          })}
        />
        {errors.description && <span className="error">{errors.description.message}</span>}
      </div>

      <div>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', {
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be greater than 0' },
            valueAsNumber: true,
          })}
        />
        {errors.amount && <span className="error">{errors.amount.message}</span>}
      </div>

      <div>
        <label>Date</label>
        <input
          type="datetime-local"
          {...register('timestamp', {
            required: 'Date is required',
            max: { value: now, message: 'Date cannot be in the future' },
          })}
        />
        {errors.timestamp && <span className="error">{errors.timestamp.message}</span>}
      </div>

      <button type="submit">{initialValues ? 'Update' : 'Add'}</button>
    </form>
  );
}

export default TxForm;

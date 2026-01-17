import { useForm } from 'react-hook-form';
import { ExpenseCategories, type CategoryBudget, type ExpenseCategory } from '../../types/types';

type BudgetFormProps = {
  initialValues: CategoryBudget | undefined;
  availableCategories: ExpenseCategory[];
  month: string;
  onSubmit: (data: CategoryBudget) => Promise<void>;
};

function CategoryBudgetForm({
  initialValues,
  availableCategories,
  month,
  onSubmit,
}: BudgetFormProps) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Category</label>
        <select {...register('category', { required: true })}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Limit</label>
        <input
          type="number"
          {...register('limit', {
            required: 'Budget limit is required',
            min: { value: 0.01, message: 'Must be greater than 0' },
            valueAsNumber: true,
          })}
        />
        {errors.limit && <span className="error">{errors.limit.message}</span>}
      </div>

      <div>
        <label>Month</label>
        <input type="month" value={month} disabled />
        <p>Month is set automatically</p>
      </div>

      <button type="submit">{initialValues ? 'Update' : 'Add'}</button>
    </form>
  );
}

export default CategoryBudgetForm;

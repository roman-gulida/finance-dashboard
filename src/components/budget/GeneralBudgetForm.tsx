import { useForm } from 'react-hook-form';
import { type GeneralBudget } from '../../types/types';

type GeneralFormProps = {
  initialValues: GeneralBudget | undefined;
  onSubmit: (budget: Omit<GeneralBudget, 'id'>) => Promise<void>;
  month: string;
};

function GeneralBudgetForm({ initialValues, onSubmit, month }: GeneralFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralBudget>({
    defaultValues: initialValues ?? {
      totalLimit: undefined,
      month,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Total Budget Limit</label>
        <input
          id="totalLimit"
          type="number"
          step="0.01"
          {...register('totalLimit', {
            required: 'Budget limit is required',
            min: { value: 0.01, message: 'Must be greater than 0' },
            valueAsNumber: true,
          })}
        />
        {errors.totalLimit && <span className="error">{errors.totalLimit.message}</span>}
      </div>

      <div>
        <label>Month</label>
        <input id="month" type="month" value={month} disabled />
        <p>Month is set automatically</p>
      </div>

      <button type="submit">{initialValues ? 'Update' : 'Set'}</button>
    </form>
  );
}

export default GeneralBudgetForm;

import {
  Categories,
  type AmountRange,
  type Category,
  type Filter,
  type TransactionType,
} from '../../types/types';
import { getType } from '../../utils/utils';
import MonthSelect from '../MonthSelect';

type TxFilterProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

function TxFilter({ filter, setFilter }: TxFilterProps) {
  const handleCategory = (category: Category) => {
    setFilter((prev) => {
      let updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];

      return { ...prev, categories: updatedCategories };
    });
  };

  const handleAmountRangeExceptions = ({ min, max }: AmountRange): AmountRange => {
    if (min !== '' && max !== '' && Number(min) > Number(max)) {
      return { min: max, max: min };
    }
    return { min, max };
  };

  const isCategoryDisabled = (category: Category) =>
    filter.type === null ? false : filter.type !== getType(category);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-8">
        <h2 className="text-2xl font-semibold">Filters</h2>
        <button
          type="button"
          className="h-7 w-18 text-sm primary-btn"
          onClick={() => {
            setFilter({
              type: null,
              categories: [],
              amountRange: { min: '', max: '' },
              month: null,
            });
          }}
        >
          Clear All
        </button>
      </div>

      <form className="flex flex-col gap-y-2">
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Type:</h3>
          <label className="transaction-filter-checkbox">
            <input
              type="checkbox"
              value={'expense' as TransactionType}
              className="cursor-pointer"
              onChange={() =>
                setFilter((prev) => ({
                  ...prev,
                  type: filter.type === 'expense' ? null : 'expense',
                }))
              }
              checked={filter.type === 'expense'}
            />
            <span className="">Expense</span>
          </label>
          <label className="transaction-filter-checkbox">
            <input
              type="checkbox"
              value={'income' as TransactionType}
              onChange={() =>
                setFilter((prev) => ({
                  ...prev,
                  type: filter.type === 'income' ? null : 'income',
                }))
              }
              checked={filter.type === 'income'}
            />
            <span>Income</span>
          </label>
        </div>

        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Category:</h3>
          {Categories.map((category) => {
            const disabled = isCategoryDisabled(category.value);

            return (
              <label
                key={category.value}
                className={`transaction-filter-checkbox ${disabled ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                <input
                  type="checkbox"
                  value={category.value}
                  disabled={disabled}
                  checked={filter.categories.includes(category.value)}
                  onChange={() => handleCategory(category.value)}
                />
                <span>{category.label}</span>
              </label>
            );
          })}
        </div>

        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Amount:</h3>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={filter.amountRange.min}
              min={0}
              className="form-input w-20 h-5 rounded-md border-2 p-2"
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  amountRange: { ...prev.amountRange, min: e.target.value },
                }))
              }
              onBlur={(e) => {
                const { min, max } = handleAmountRangeExceptions({
                  min: e.target.value,
                  max: filter.amountRange.max,
                });
                setFilter((prev) => ({
                  ...prev,
                  amountRange: { min, max },
                }));
              }}
            />
            <span className="w-2 text-lg flex justify-center">-</span>
            <input
              type="number"
              value={filter.amountRange.max}
              className="form-input w-20 h-5 rounded-md border-2 p-2"
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  amountRange: { ...prev.amountRange, max: e.target.value },
                }))
              }
              onBlur={(e) => {
                const { min, max } = handleAmountRangeExceptions({
                  min: filter.amountRange.min,
                  max: e.target.value,
                });
                setFilter((prev) => ({
                  ...prev,
                  amountRange: { min, max },
                }));
              }}
            />
            <button
              type="button"
              className="h-7 w-13 text-sm primary-btn ml-3"
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  amountRange: { min: '', max: '' },
                }))
              }
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold">Month:</h3>
          <div className="flex items-center gap-3">
            <MonthSelect
              value={filter.month}
              onChange={(value) => setFilter((prev) => ({ ...prev, month: value }))}
            />
            <button
              type="button"
              className="h-7 w-13 text-sm primary-btn"
              onClick={() => {
                setFilter((prev) => ({
                  ...prev,
                  month: null,
                }));
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TxFilter;

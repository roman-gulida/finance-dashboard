import {
  Categories,
  type AmountRange,
  type Category,
  type Filter,
  type Sort,
  type TransactionType,
} from '../../types/types';
import { getType } from '../../utils/utils';

type TxFilterProps = {
  sort: Sort;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

function TxFilter({
  sort,
  setSort,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
}: TxFilterProps) {
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

  return (
    <>
      <div className="sorting">
        <label>Sort by: </label>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="dateNewest">Date - Newest first</option>
          <option value="dateOldest">Date - Oldest first</option>
          <option value="amountAsc">Amount - Low to High</option>
          <option value="amountDesc">Amount - High to Low</option>
          <option value="category">Category (A-Z)</option>
        </select>
      </div>

      <div className="filtering">
        <span>Filter by: </span>
        <form>
          <div className="type">
            <span>Type:</span>
            <label>
              <input
                type="checkbox"
                value={'expense' as TransactionType}
                onChange={() =>
                  setFilter((prev) => ({
                    ...prev,
                    type: filter.type === 'expense' ? null : 'expense',
                  }))
                }
                checked={filter.type === 'expense'}
              />
              <span>Expense</span>
            </label>
            <label>
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

          <div className="categories">
            <span>Category:</span>
            {Categories.map((category) => (
              <div className="filter-category" key={category.value}>
                <label>
                  <input
                    type="checkbox"
                    value={category.value}
                    disabled={
                      filter.type === null ? false : filter.type !== getType(category.value)
                    }
                    checked={filter.categories.includes(category.value)}
                    onChange={() => handleCategory(category.value)}
                  />
                  <span>{category.label}</span>
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFilter((prev) => ({ ...prev, categories: [] }));
              }}
            >
              Clear
            </button>
          </div>

          <div className="amount">
            <span>Amount:</span>
            <input
              type="number"
              value={filter.amountRange.min}
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
            <span> -- </span>
            <input
              type="number"
              value={filter.amountRange.max}
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

          <div className="month">
            <span>Month:</span>
            <input
              type="month"
              value={filter.month || ''}
              onChange={(e) => setFilter((prev) => ({ ...prev, month: e.target.value }))}
            />
            <button
              type="button"
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
          <button
            type="button"
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
        </form>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search by description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" onClick={() => setSearchQuery('')}>
          Clear
        </button>
      </div>
    </>
  );
}

export default TxFilter;

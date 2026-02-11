import { ChevronDown } from 'lucide-react';
import type { Sort } from '../../types/types';

type TxFilterProps = {
  sort: Sort;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
};

function TxSort({ sort, setSort }: TxFilterProps) {
  return (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as Sort)}
        className="form-input outline-none h-11 py-2 px-3 pr-10 appearance-none cursor-pointer"
      >
        <option value="category">Category (A-Z)</option>
        <option value="dateNewest">Date - Newest first</option>
        <option value="dateOldest">Date - Oldest first</option>
        <option value="amountAsc">Amount - Low to High</option>
        <option value="amountDesc">Amount - High to Low</option>
      </select>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  );
}

export default TxSort;

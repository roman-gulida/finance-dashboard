import { Search, X } from 'lucide-react';
import { useRef } from 'react';

type TxSearchProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

function TxSearch({ searchQuery, setSearchQuery }: TxSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="h-11 form-input px-3 py-2 flex items-center cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <Search size={18} />
      <input
        type="text"
        placeholder="Search by description"
        value={searchQuery}
        ref={inputRef}
        className="outline-none pl-2 placeholder:text-primary-900/50 dark:placeholder:text-primary-100/50"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="button" onClick={() => setSearchQuery('')} className="icon-btn p-1">
        <X size={18} />
      </button>
    </div>
  );
}

export default TxSearch;

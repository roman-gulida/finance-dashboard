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
      className="w-full h-11 form-input px-2 py-2 flex items-center cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <Search size={18} className="shrink-0" />
      <input
        type="text"
        placeholder="Search by description"
        value={searchQuery}
        ref={inputRef}
        className="flex-1 outline-none pl-2 text-sm sm:text-base placeholder:text-primary-900/50 dark:placeholder:text-primary-100/50"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button type="button" onClick={() => setSearchQuery('')} className="icon-btn p-1 shrink-0">
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default TxSearch;

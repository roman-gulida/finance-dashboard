import { SquarePen, Trash } from 'lucide-react';
import type { Transaction } from '../../types/types';
import { formatDateDay, getCategoryLabel } from '../../utils/utils';

type TxCardProps = {
  tx: Transaction;
  handleEdit: (tx: Transaction) => void;
  handleRemove: (txId: string) => void;
};

function TxCard({ tx, handleEdit, handleRemove }: TxCardProps) {
  const isExpense = tx.type === 'expense';

  return (
    <div className="w-full h-40 card-surface card-interactive p-4">
      <div className="flex flex-col items-center">
        <p className="text-base sm:text-lg font-semibold truncate w-full text-center">
          {getCategoryLabel(tx.category)}
        </p>
        <p className="text-xs sm:text-sm line-clamp-1 text-primary-500 dark:text-primary-200 px-2">
          {tx.description}
        </p>
        <p
          className={`my-1 text-lg sm:text-xl font-bold ${isExpense ? 'text-red-500' : 'text-green-500'}`}
        >
          {isExpense ? '-' : '+'}${tx.amount.toFixed(2)}
        </p>
        <p className="text-xs sm:text-sm text-primary-500 dark:text-primary-200">
          {formatDateDay(tx.timestamp)}
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 sm:gap-6 mt-1">
        <button onClick={() => handleEdit(tx)} className="p-1.5 icon-btn">
          <SquarePen size={18} />
        </button>
        <button
          onClick={() => handleRemove(tx.id)}
          className="p-1.5 icon-btn hover:bg-red-600/80 dark:hover:bg-red-500/90"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}

export default TxCard;

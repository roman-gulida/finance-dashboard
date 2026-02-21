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
    <div className="w-50 h-40 bg-primary-100 dark:bg-primary-900 border-2 border-primary-300 dark:border-primary-700 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-200">
      <div className="flex flex-col items-center">
        <p className="text-lg font-semibold">{getCategoryLabel(tx.category)}</p>
        <p className="text-sm line-clamp-1 text-primary-500 dark:text-primary-200">
          {tx.description}
        </p>
        <p className={`my-1 text-xl ${isExpense ? 'text-red-500' : 'text-green-500'}`}>
          {isExpense ? '-' : '+'}${tx.amount.toFixed(2)}
        </p>
        <p className="text-sm text-primary-500 dark:text-primary-200">
          {formatDateDay(tx.timestamp)}
        </p>
      </div>

      <div className="flex justify-center items-center gap-6 mt-1">
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

import { SquarePen, Trash } from 'lucide-react';
import type { Transaction } from '../../types/types';
import { formatDateDay, getCategoryLabel } from '../../utils/utils';

type TxCardProps = {
  tx: Transaction;
  handleEdit: (tx: Transaction) => void;
  handleRemove: (txId: string) => void;
};

function TxCard({ tx, handleEdit, handleRemove }: TxCardProps) {
  return (
    <div className="tx-card">
      {getCategoryLabel(tx.category)} {tx.description} {tx.amount} {tx.type}{' '}
      {formatDateDay(tx.timestamp)}
      <button onClick={() => handleEdit(tx)}>
        <span>
          <SquarePen size={16} /> {'Edit'}
        </span>
      </button>
      <button onClick={() => handleRemove(tx.id)}>
        <span>
          <Trash size={16} />
          {'Delete'}
        </span>
      </button>
    </div>
  );
}

export default TxCard;

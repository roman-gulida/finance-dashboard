import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { Transaction } from '../../types/types';
import TxForm from './TxForm';

type TxModalProps = {
  isOpen: boolean;
  initialValues: Transaction | undefined;
  onClose: () => void;
  onSubmit: (data: Transaction) => void;
};

function TxModal({ isOpen, initialValues, onClose, onSubmit }: TxModalProps) {
  return (
    <div className="tx-modal">
      <Dialog open={isOpen} onClose={onClose}>
        <DialogPanel>
          <DialogTitle>{initialValues ? 'Edit' : 'Add'} Transaction</DialogTitle>
          <TxForm initialValues={initialValues} onSubmit={onSubmit} />
          <Button type="button" onClick={onClose}>
            x
          </Button>
        </DialogPanel>
      </Dialog>
    </div>
  );
}

export default TxModal;

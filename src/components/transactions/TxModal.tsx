import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { Transaction } from '../../types/types';
import TxForm from './TxForm';
import { X } from 'lucide-react';

type TxModalProps = {
  isOpen: boolean;
  initialValues: Transaction | undefined;
  onClose: () => void;
  onSubmit: (data: Transaction) => void;
};

function TxModal({ isOpen, initialValues, onClose, onSubmit }: TxModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-primary-50 dark:bg-primary-950 rounded-3xl border-2 border-primary-300 dark:border-primary-700 shadow-2xl transform transition-all">
          <div className="flex items-center pt-4 px-4 justify-between">
            <DialogTitle className="text-2xl font-bold text-highlight pl-30">
              {initialValues ? 'Edit' : 'Add'} Transaction
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="px-6 py-4">
            <TxForm initialValues={initialValues} onSubmit={onSubmit} onClose={onClose} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default TxModal;

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import CategoryBudgetForm from './CategoryBudgetForm';
import type { CategoryBudget, ExpenseCategory } from '../../types/types';

type CategoryBudgetModalProps = {
  isOpen: boolean;
  initialValues: CategoryBudget | undefined;
  availableCategories: ExpenseCategory[];
  month: string;
  onClose: () => void;
  onSubmit: (data: CategoryBudget) => void;
};

function CategoryBudgetModal({
  isOpen,
  initialValues,
  availableCategories,
  month,
  onClose,
  onSubmit,
}: CategoryBudgetModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-primary-50 dark:bg-primary-950 rounded-3xl border-2 border-primary-300 dark:border-primary-700 shadow-2xl transform transition-all">
          <div className="flex items-center justify-between p-6 border-b-2 border-primary-200 dark:border-primary-800">
            <DialogTitle className="text-2xl font-bold text-highlight">
              {initialValues ? 'Edit' : 'Add'} Category Budget
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <CategoryBudgetForm
              initialValues={initialValues}
              availableCategories={availableCategories}
              month={month}
              onSubmit={onSubmit}
              onClose={onClose}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default CategoryBudgetModal;

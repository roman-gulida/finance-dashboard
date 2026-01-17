import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import type { CategoryBudget, ExpenseCategory } from '../../types/types';
import CategoryBudgetForm from './CategoryBudgetForm';

type CategoryBudgetModalProps = {
  isOpen: boolean;
  initialValues: CategoryBudget | undefined;
  availableCategories: ExpenseCategory[];
  month: string;
  onClose: () => void;
  onSubmit: (data: CategoryBudget) => Promise<void>;
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
    <div className="budget-modal">
      <Dialog open={isOpen} onClose={onClose}>
        <DialogPanel>
          <DialogTitle>{initialValues ? 'Edit' : 'Add'} Budget</DialogTitle>
          <CategoryBudgetForm
            initialValues={initialValues}
            availableCategories={availableCategories}
            month={month}
            onSubmit={onSubmit}
          />
          <Button type="button" onClick={onClose}>
            x
          </Button>
        </DialogPanel>
      </Dialog>
    </div>
  );
}

export default CategoryBudgetModal;

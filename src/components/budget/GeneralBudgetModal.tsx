import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import type { GeneralBudget } from '../../types/types';
import GeneralBudgetForm from './GeneralBudgetForm';

type GeneralBudgetModalProps = {
  isOpen: boolean;
  initialValues?: GeneralBudget;
  onClose: () => void;
  onSubmit: (budget: Omit<GeneralBudget, 'id'>) => Promise<void>;
  month: string;
};

function GeneralBudgetModal({
  isOpen,
  initialValues,
  onClose,
  onSubmit,
  month,
}: GeneralBudgetModalProps) {
  return (
    <div className="budget-modal">
      <Dialog open={isOpen} onClose={onClose}>
        <DialogPanel>
          <DialogTitle>{initialValues ? 'Edit' : 'Add'} Overall Budget</DialogTitle>
          <GeneralBudgetForm initialValues={initialValues} onSubmit={onSubmit} month={month} />
          <Button type="button" onClick={onClose}>
            x
          </Button>
        </DialogPanel>
      </Dialog>
    </div>
  );
}

export default GeneralBudgetModal;

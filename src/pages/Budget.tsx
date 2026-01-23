import { useMemo, useState } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import CategoryBudgetCard from '../components/budget/CategoryBudgetCard';
import {
  ExpenseCategories,
  type CategoryBudget,
  type ExpenseCategory,
  type GeneralBudget,
} from '../types/types';
import CategoryBudgetModal from '../components/budget/CategoryBudgetModal';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TxContext';
import GeneralBudgetModal from '../components/budget/GeneralBudgetModal';
import ProgressBar from '../components/ProgressBar';
import toast from 'react-hot-toast';
import { useMonthlyBudgetCalculations } from '../hooks/budgets/useMonthlyBudget';
import ErrorDisplay from '../components/ErrorDisplay';
import Loading from '../components/Loading';
import { Frown, SquarePen, Trash } from 'lucide-react';

function Budget() {
  const {
    categoryBudgets,
    addCategoryBudget,
    editCategoryBudget,
    removeCategoryBudget,

    generalBudget,
    addGeneralBudget,
    editGeneralBudget,
    removeGeneralBudget,

    isLoading,
    error,
    refetch,

    selectedMonth,
    setSelectedMonth,
  } = useBudget();
  const { user } = useAuth();
  const { transactions } = useTransactions();

  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [editingCategoryBudget, setEditingCategoryBudget] = useState<CategoryBudget | undefined>(
    undefined,
  );

  const [isGeneralOpen, setIsGeneralOpen] = useState<boolean>(false);

  const userId = user!.id;

  const { monthCategoryBudgets, totalSpent, totalIncome, exceededCount, spentByCategory } =
    useMonthlyBudgetCalculations({ categoryBudgets, transactions, selectedMonth });

  const availableCategories = useMemo<ExpenseCategory[]>(() => {
    const usedCategories = monthCategoryBudgets.map((b) => b.category);

    return ExpenseCategories.map((ec) => ec.value).filter((ec) => !usedCategories.includes(ec));
  }, [monthCategoryBudgets]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  const handleCategorySubmit = async (budget: CategoryBudget) => {
    try {
      editingCategoryBudget
        ? await editCategoryBudget({ ...budget, id: editingCategoryBudget.id, userId })
        : await addCategoryBudget({ ...budget, userId });

      setIsCategoryOpen(false);
      toast.success(`Budget ${editingCategoryBudget ? 'edited' : 'added'} successfully`);
    } catch (err) {
      toast.error(`Failed to ${editingCategoryBudget ? 'edit' : 'add'} save budget`);
    } finally {
      setEditingCategoryBudget(undefined);
    }
  };

  const handleCategoryEdit = (budget: CategoryBudget) => {
    setEditingCategoryBudget(budget);
    setIsCategoryOpen(true);
  };

  const handleCategoryRemove = async (budgetId: string) => {
    try {
      await removeCategoryBudget(budgetId);
      toast.success('Budget deleted successfully');
    } catch (err) {
      toast.error('Failed to delete budget');
    }
  };

  const handleGeneralSubmit = async (budget: Omit<GeneralBudget, 'id'>) => {
    try {
      const isEdit = generalBudget !== null;
      isEdit
        ? await editGeneralBudget({ ...budget, id: generalBudget.id, userId })
        : await addGeneralBudget({ ...budget, userId });

      setIsGeneralOpen(false);
      toast.success(`Overall budget ${isEdit ? 'edited' : 'added'} successfully`);
    } catch (err) {
      toast.error('Failed to save general budget');
    }
  };

  const handleGeneralRemove = async () => {
    try {
      generalBudget && (await removeGeneralBudget(generalBudget.id));
      toast.success('Overall budget deleted successfully');
    } catch (err) {
      toast.error('Failed to delete general budget');
    }
  };

  return (
    <>
      <div className="month">
        <span>Month:</span>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="general-budget">
        <h2>Overall Budget</h2>
        {generalBudget ? (
          <>
            <p>Total Budget: ${generalBudget.totalLimit}</p>
            <p>Total Spent: ${totalSpent}</p>
            <p>Total Income: ${totalIncome}</p>
            <p>Remaining: ${generalBudget.totalLimit - totalSpent}</p>

            <span>
              ${totalSpent} / ${generalBudget.totalLimit}
            </span>
            <ProgressBar percentage={(totalSpent / generalBudget.totalLimit) * 100} />

            <p>{exceededCount} categories over budget</p>
            <p>{monthCategoryBudgets.length - exceededCount} categories on track</p>

            <button onClick={() => setIsGeneralOpen(true)}>
              <span>
                <SquarePen size={16} /> {'Edit'}
              </span>
            </button>
            <button onClick={handleGeneralRemove}>
              <span>
                <Trash size={16} /> {'Delete'}
              </span>
            </button>
          </>
        ) : (
          <>
            <Frown />
            <p>The general budget has not been set yet. Try adding a new general budget.</p>
            <button onClick={() => setIsGeneralOpen(true)}>Set General Budget</button>
          </>
        )}
      </div>

      <div className="category-budgets">
        <h2>Category Budgets</h2>
        {availableCategories.length > 0 && (
          <button
            onClick={() => {
              setEditingCategoryBudget(undefined);
              setIsCategoryOpen(true);
            }}
          >
            Add Category Budget
          </button>
        )}
      </div>

      {monthCategoryBudgets.length === 0 ? (
        <>
          <Frown />
          <p>The category budget has not been set yet. Try adding a new budget for categories.</p>
        </>
      ) : (
        <ul>
          {monthCategoryBudgets.map((b) => {
            return (
              <li key={b.id}>
                <CategoryBudgetCard
                  budget={b}
                  spentByCategory={spentByCategory[b.category] ?? 0}
                  handleEdit={handleCategoryEdit}
                  handleRemove={handleCategoryRemove}
                />
              </li>
            );
          })}
        </ul>
      )}

      <GeneralBudgetModal
        isOpen={isGeneralOpen}
        onClose={() => setIsGeneralOpen(false)}
        onSubmit={handleGeneralSubmit}
        initialValues={generalBudget || undefined}
        month={selectedMonth}
      />

      <CategoryBudgetModal
        isOpen={isCategoryOpen}
        initialValues={editingCategoryBudget}
        availableCategories={availableCategories}
        month={selectedMonth}
        onClose={() => {
          setIsCategoryOpen(false);
          setEditingCategoryBudget(undefined);
        }}
        onSubmit={handleCategorySubmit}
      />
    </>
  );
}

export default Budget;

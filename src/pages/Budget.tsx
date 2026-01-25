import { useMemo, useState } from 'react';
import CategoryBudgetCard from '../components/budget/CategoryBudgetCard';
import {
  ExpenseCategories,
  type CategoryBudget,
  type ExpenseCategory,
  type GeneralBudget,
} from '../types/types';
import CategoryBudgetModal from '../components/budget/CategoryBudgetModal';
import { useAuth } from '../contexts/AuthContext';
import GeneralBudgetModal from '../components/budget/GeneralBudgetModal';
import ProgressBar from '../components/ProgressBar';
import toast from 'react-hot-toast';
import { useMonthlyBudgetCalculations } from '../hooks/budgets/useMonthlyBudgetCalculations';
import ErrorDisplay from '../components/ErrorDisplay';
import Loading from '../components/Loading';
import { Frown, SquarePen, Trash } from 'lucide-react';
import { useTransactions } from '../hooks/transactions/useTransactions';
import { useCategoryBudgets } from '../hooks/budgets/useCategoryBudgets';
import { useGeneralBudget } from '../hooks/budgets/useGeneralBudget';
import { getCurrentMonth } from '../utils/utils';
import { useCategoryBudgetMutations } from '../hooks/budgets/useCategoryBudgetMutations';
import { useGeneralBudgetMutations } from '../hooks/budgets/useGeneralBudgetMutations';

function Budget() {
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  const {
    addCategoryBudget: { mutate: addCategoryBudget },
    editCategoryBudget: { mutate: editCategoryBudget },
    removeCategoryBudget: { mutate: removeCategoryBudget },
  } = useCategoryBudgetMutations();
  const {
    addGeneralBudget: { mutate: addGeneralBudget },
    editGeneralBudget: { mutate: editGeneralBudget },
    removeGeneralBudget: { mutate: removeGeneralBudget },
  } = useGeneralBudgetMutations();
  const {
    data: categoryBudgets = [],
    isPending: isPendingCategoryBudget,
    error: categoryBudgetError,
    refetch: refetchCategoryBudget,
  } = useCategoryBudgets();
  const {
    data: generalBudget,
    isPending: isPendingGeneralBudget,
    error: generalBudgetError,
    refetch: refetchGeneralBudget,
  } = useGeneralBudget(selectedMonth);
  const { user } = useAuth();
  const {
    data: transactions = [],
    isPending: isPendingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransactions();

  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [editingCategoryBudget, setEditingCategoryBudget] = useState<CategoryBudget | undefined>(
    undefined,
  );

  const [isGeneralOpen, setIsGeneralOpen] = useState<boolean>(false);

  const userId = user!.id;

  const { monthCategoryBudgets, totalSpent, totalIncome, exceededCount, spentByCategory } =
    useMonthlyBudgetCalculations({
      categoryBudgets: categoryBudgets,
      transactions: transactions,
      selectedMonth,
    });

  const availableCategories = useMemo<ExpenseCategory[]>(() => {
    const usedCategories = monthCategoryBudgets.map((b) => b.category);

    return ExpenseCategories.map((ec) => ec.value).filter((ec) => !usedCategories.includes(ec));
  }, [monthCategoryBudgets]);

  const handleRefetch = async () => {
    await Promise.all([
      transactionsError && refetchTransactions(),
      generalBudgetError && refetchGeneralBudget(),
      categoryBudgetError && refetchCategoryBudget(),
    ]);
  };

  if (isPendingCategoryBudget || isPendingGeneralBudget || isPendingTransactions) {
    return <Loading />;
  }

  const error = transactionsError || categoryBudgetError || generalBudgetError;
  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRefetch} />;
  }

  const handleCategorySubmit = async (budget: CategoryBudget) => {
    editingCategoryBudget
      ? editCategoryBudget(
          { ...budget, id: editingCategoryBudget.id, userId },
          {
            onSuccess: () => toast.success('Budget edited successfully'),
            onError: () => toast.error('Failed to edit save budget'),
            onSettled: () => {
              setIsCategoryOpen(false);
              setEditingCategoryBudget(undefined);
            },
          },
        )
      : addCategoryBudget(
          { ...budget, userId },
          {
            onSuccess: () => toast.success('Budget added successfully'),
            onError: () => toast.error('Failed to add save budget'),
            onSettled: () => {
              setIsCategoryOpen(false);
              setEditingCategoryBudget(undefined);
            },
          },
        );
  };

  const handleCategoryEdit = (budget: CategoryBudget) => {
    setEditingCategoryBudget(budget);
    setIsCategoryOpen(true);
  };

  const handleCategoryRemove = async (budgetId: string) => {
    removeCategoryBudget(budgetId, {
      onSuccess: () => toast.success('Budget deleted successfully'),
      onError: () => toast.error('Failed to delete budget'),
    });
  };

  const handleGeneralSubmit = async (budget: Omit<GeneralBudget, 'id'>) => {
    const isEdit = generalBudget !== null;
    isEdit
      ? editGeneralBudget(
          { ...budget, id: generalBudget!.id, userId },
          {
            onSuccess: () => toast.success('Overall budget edited successfully'),
            onError: () => toast.error('Failed to save general budget'),
            onSettled: () => setIsGeneralOpen(false),
          },
        )
      : addGeneralBudget(
          { ...budget, userId },
          {
            onSuccess: () => toast.success('Overall budget added successfully'),
            onError: () => toast.error('Failed to save general budget'),
            onSettled: () => setIsGeneralOpen(false),
          },
        );
  };

  const handleGeneralRemove = async () => {
    generalBudget &&
      removeGeneralBudget(generalBudget.id, {
        onSuccess: () => toast.success('Overall budget deleted successfully'),
        onError: () => toast.error('Failed to delete general budget'),
      });
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

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
import MonthSelect from '../components/MonthSelect';

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
  } = useGeneralBudgetMutations(selectedMonth);
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
      <div className="mx-10 mb-4 sticky top-5 z-10 flex justify-center items-center gap-2">
        <MonthSelect
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value || getCurrentMonth())}
          includeAllOption={false}
        />
      </div>

      <div className="flex">
        <aside className="w-1/3 pl-8">
          <div className="sticky top-30">
            <div className="p-4 flex flex-col items-center bg-linear-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 border-3 border-primary-300 dark:border-primary-700 rounded-3xl shadow-lg transition-colors duration-200 ease-out">
              <h2 className="mb-4 text-3xl font-bold pt-2">Overall Budget</h2>

              {generalBudget ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary-50/60 dark:bg-primary-950/60 rounded-2xl p-4">
                      <p className="text-xs text-highlight mb-1">Total Budget</p>
                      <p className="text-lg font-bold">${generalBudget.totalLimit.toFixed(2)}</p>
                    </div>
                    <div className="bg-primary-50/60 dark:bg-primary-950/60 rounded-2xl p-4">
                      <p className="text-xs text-highlight mb-1">Total Spent</p>
                      <p className="text-lg font-bold text-red-600 dark:text-red-500">
                        ${totalSpent.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-primary-50/60 dark:bg-primary-950/60 rounded-2xl p-4">
                      <p className="text-xs text-highlight mb-1">Total Income</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-500">
                        ${totalIncome.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-primary-50/60 dark:bg-primary-950/60 rounded-2xl p-4">
                      <p className="text-xs text-highlight mb-1">Remaining</p>
                      <p className="text-lg font-bold">
                        ${(generalBudget.totalLimit - totalSpent).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary-50/60 dark:bg-primary-950/60 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-highlight">Progress</span>
                      <span className="font-semibold">
                        ${totalSpent.toFixed(2)} / ${generalBudget.totalLimit.toFixed(2)}
                      </span>
                    </div>
                    <ProgressBar percentage={(totalSpent / generalBudget.totalLimit) * 100} />
                  </div>

                  <div className="flex justify-around py-3 bg-primary-50/60 dark:bg-primary-950/60 rounded-2xl">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                        {exceededCount}
                      </p>
                      <p className="text-xs text-highlight">Over Budget</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                        {monthCategoryBudgets.length - exceededCount}
                      </p>
                      <p className="text-xs text-highlight">On Track</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setIsGeneralOpen(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3  bg-primary-400 hover:bg-primary-500 dark:bg-primary-600 rounded-2xl transition-colors font-semibold"
                    >
                      <SquarePen size={18} />
                      Edit
                    </button>
                    <button
                      onClick={handleGeneralRemove}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/90 hover:bg-red-600 dark:bg-red-600/80 dark:hover:bg-red-500/90 rounded-2xl transition-colors"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  <Frown size={56} className="mb-4 text-primary-400" />
                  <p className="text-primary-600 dark:text-primary-400 mb-4">
                    No general budget set for this month
                  </p>
                  <button
                    onClick={() => setIsGeneralOpen(true)}
                    className="px-6 py-3 primary-btn font-semibold"
                  >
                    Set General Budget
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 px-8 pb-8 pt-4">
          <div className="flex items-center justify-evenly mb-8">
            <h2 className="text-3xl font-bold">Category Budgets</h2>
            {availableCategories.length > 0 && (
              <button
                onClick={() => {
                  setEditingCategoryBudget(undefined);
                  setIsCategoryOpen(true);
                }}
                className="px-3 py-2 primary-btn"
              >
                Add Category Budget
              </button>
            )}
          </div>

          {monthCategoryBudgets.length === 0 ? (
            <div className="p-20 flex flex-col items-center gap-3">
              <Frown size={64} className="text-primary-400" />
              <p className="text-center text-lg text-primary-400">
                The category budget has not been set yet. Try adding a new budget for categories.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-3 gap-4">
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
        </main>
      </div>

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

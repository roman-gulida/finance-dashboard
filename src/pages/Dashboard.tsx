import SpendingByCategory from '../components/dashboard/SpendingByCategory';
import IncomeVsExpenseChart from '../components/dashboard/IncomeVsExpense';
import { useMonthlyBudgetCalculations } from '../hooks/budgets/useMonthlyBudgetCalculations';
import { useMemo } from 'react';
import Stats from '../components/dashboard/Stats';
import RecentTxs from '../components/dashboard/RecentTxs';
import BudgetSummary from '../components/dashboard/BudgetSummary';
import { useTransactions } from '../hooks/transactions/useTransactions';
import { useGeneralBudget } from '../hooks/budgets/useGeneralBudget';
import { useCategoryBudgets } from '../hooks/budgets/useCategoryBudgets';

function Dashboard() {
  const {
    data: transactions,
    isPending: isPendingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransactions();
  const {
    data: generalBudget,
    isPending: isPendingGeneralBudget,
    error: generalBudgetError,
    refetch: refetchGeneralBudget,
  } = useGeneralBudget();
  const {
    data: categoryBudgets,
    isPending: isPendingCategoryBudget,
    error: categoryBudgetError,
    refetch: refetchCategoryBudget,
  } = useCategoryBudgets();

  const { totalSpent, monthCategoryBudgets, totalIncome, spentByCategory } =
    useMonthlyBudgetCalculations({
      categoryBudgets: categoryBudgets ?? [],
      transactions: transactions ?? [],
    });

  const { fiveLastTxs, halfYearTxs } = useMemo(() => {
    const fiveLastTxs = transactions
      ? [...transactions]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)
      : [];

    const halfYearAgo = new Date();
    halfYearAgo.setMonth(halfYearAgo.getMonth() - 6);
    const halfYearAgoTs = halfYearAgo.getTime();

    const halfYearTxs = transactions
      ? transactions.filter((tx) => new Date(tx.timestamp).getTime() > halfYearAgoTs)
      : [];

    return { fiveLastTxs, halfYearTxs };
  }, [transactions]);

  const budgetStats: number | null = generalBudget
    ? (totalSpent / generalBudget.totalLimit) * 100
    : null;

  const handleRefetch = async () => {
    await Promise.all([
      transactionsError && refetchTransactions(),
      generalBudgetError && refetchGeneralBudget(),
      categoryBudgetError && refetchCategoryBudget(),
    ]);
  };

  return (
    <>
      <Stats
        totalIncome={totalIncome}
        totalSpent={totalSpent}
        budgetStats={budgetStats}
        isLoading={isPendingTransactions || isPendingGeneralBudget}
        error={transactionsError || generalBudgetError}
        refetch={handleRefetch}
      />
      <SpendingByCategory
        spentByCategory={spentByCategory}
        isLoading={isPendingTransactions}
        error={transactionsError}
        refetch={() => {
          void refetchTransactions();
        }}
      />
      <RecentTxs
        fiveLastTxs={fiveLastTxs}
        isLoading={isPendingTransactions}
        error={transactionsError}
        refetch={() => {
          void refetchTransactions();
        }}
      />
      <BudgetSummary
        generalBudget={generalBudget ?? null}
        categoryBudgets={monthCategoryBudgets}
        spentByCategory={spentByCategory}
        totalSpent={totalSpent}
        isLoading={isPendingTransactions || isPendingGeneralBudget || isPendingCategoryBudget}
        error={transactionsError || generalBudgetError || categoryBudgetError}
        refetch={handleRefetch}
      />
      <IncomeVsExpenseChart
        transactions={halfYearTxs}
        isLoading={isPendingTransactions}
        error={transactionsError}
        refetch={() => {
          void refetchTransactions();
        }}
      />
    </>
  );
}

export default Dashboard;

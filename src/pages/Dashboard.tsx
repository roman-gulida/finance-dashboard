import { useTransactions } from '../contexts/TxContext';
import { useBudget } from '../contexts/BudgetContext';
import SpendingByCategory from '../components/dashboard/SpendingByCategory';
import IncomeVsExpenseChart from '../components/dashboard/IncomeVsExpense';
import { useMonthlyBudgetCalculations } from '../hooks/useMonthlyBudget';
import { useCallback, useMemo } from 'react';
import Stats from '../components/dashboard/Stats';
import RecentTxs from '../components/dashboard/RecentTxs';
import BudgetSummary from '../components/dashboard/BudgetSummary';

function Dashboard() {
  const {
    transactions,
    isLoading: txLoading,
    error: txError,
    refetch: refetchTxs,
  } = useTransactions();
  const {
    generalBudget,
    categoryBudgets,
    selectedMonth,
    isLoading: budgetLoading,
    error: budgetError,
    refetch: refetchBudgets,
  } = useBudget();

  const { totalSpent, monthCategoryBudgets, totalIncome, spentByCategory } =
    useMonthlyBudgetCalculations({
      categoryBudgets,
      transactions,
      selectedMonth,
    });

  const { fiveLastTxs, halfYearTxs } = useMemo(() => {
    const fiveLastTxs = [...transactions]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    const halfYearAgo = new Date();
    halfYearAgo.setMonth(halfYearAgo.getMonth() - 6);
    const halfYearAgoTs = halfYearAgo.getTime();

    const halfYearTxs = transactions.filter(
      (tx) => new Date(tx.timestamp).getTime() > halfYearAgoTs,
    );

    return { fiveLastTxs, halfYearTxs };
  }, [transactions]);

  const budgetStats: number | null = generalBudget
    ? (totalSpent / generalBudget.totalLimit) * 100
    : null;

  const handleRefetch = useCallback(async () => {
    if (txError) await refetchTxs();
    if (budgetError) await refetchBudgets();
  }, [txError, budgetError, refetchTxs, refetchBudgets]);

  const isLoadingTxAndBudget = txLoading || budgetLoading;
  const errorTxAndBudget = txError || budgetError;

  return (
    <>
      <Stats
        totalIncome={totalIncome}
        totalSpent={totalSpent}
        budgetStats={budgetStats}
        isLoading={isLoadingTxAndBudget}
        error={errorTxAndBudget}
        refetch={handleRefetch}
      />
      <SpendingByCategory
        spentByCategory={spentByCategory}
        isLoading={txLoading}
        error={txError}
        refetch={refetchTxs}
      />
      <RecentTxs
        fiveLastTxs={fiveLastTxs}
        isLoading={txLoading}
        error={txError}
        refetch={refetchTxs}
      />
      <BudgetSummary
        generalBudget={generalBudget}
        categoryBudgets={monthCategoryBudgets}
        spentByCategory={spentByCategory}
        totalSpent={totalSpent}
        isLoading={isLoadingTxAndBudget}
        error={errorTxAndBudget}
        refetch={handleRefetch}
      />
      <IncomeVsExpenseChart
        transactions={halfYearTxs}
        isLoading={txLoading}
        error={txError}
        refetch={refetchTxs}
      />
    </>
  );
}

export default Dashboard;

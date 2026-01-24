import { useMemo } from 'react';
import type { CategoryBudget, ExpenseCategory, Transaction } from '../../types/types';
import { getCurrentMonth } from '../../utils/utils';

type UseMonthlyBudgetCalculationsProps = {
  categoryBudgets: CategoryBudget[];
  transactions: Transaction[];
  selectedMonth?: string;
};

type MonthlyBudgetCalculations = {
  monthCategoryBudgets: CategoryBudget[];
  totalSpent: number;
  totalIncome: number;
  exceededCount: number;
  spentByCategory: Record<string, number>;
};

export function useMonthlyBudgetCalculations({
  categoryBudgets,
  transactions,
  selectedMonth = getCurrentMonth(),
}: UseMonthlyBudgetCalculationsProps): MonthlyBudgetCalculations {
  return useMemo(() => {
    const monthCategoryBudgets = categoryBudgets.filter((b) => b.month === selectedMonth);

    const monthTransactions = transactions.filter((tx) => tx.timestamp.startsWith(selectedMonth));

    const { totalSpent, totalIncome, spentByCategory } = monthTransactions.reduce(
      (acc, tx) => {
        if (tx.type === 'expense') {
          acc.totalSpent += tx.amount;
          acc.spentByCategory[tx.category] = (acc.spentByCategory[tx.category] ?? 0) + tx.amount;
        } else {
          acc.totalIncome += tx.amount;
        }

        return acc;
      },
      {
        totalIncome: 0,
        totalSpent: 0,
        spentByCategory: {} as Record<ExpenseCategory, number>,
      },
    );

    const exceededCount = monthCategoryBudgets.filter(
      (budget) => (spentByCategory[budget.category as ExpenseCategory] ?? 0) > budget.limit,
    ).length;

    return {
      monthCategoryBudgets,
      totalSpent,
      totalIncome,
      exceededCount,
      spentByCategory,
    };
  }, [categoryBudgets, transactions, selectedMonth]);
}

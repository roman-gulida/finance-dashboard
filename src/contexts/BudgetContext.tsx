import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CategoryBudget, BudgetContext, GeneralBudget } from '../types/types';
import {
  createCategoryBudget,
  createGeneralBudget,
  deleteCategoryBudget,
  deleteGeneralBudget,
  getCategoryBudgets,
  getGeneralBudget,
  updateCategoryBudget,
  updateGeneralBudget,
} from '../services/budgetService';
import { useAuth } from './AuthContext';
import { getCurrentMonth } from '../utils/utils';

type BudgetProviderProps = {
  children: ReactNode;
};

const BudgetContext = createContext<BudgetContext | undefined>(undefined);

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const { user } = useAuth();

  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [generalBudget, setGeneralBudget] = useState<GeneralBudget | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const categoryBudgets = await getCategoryBudgets(user.id);
      const generalBudget = await getGeneralBudget(user.id, selectedMonth);
      setCategoryBudgets(categoryBudgets ?? []);
      setGeneralBudget(generalBudget ?? null);
    } catch (err) {
      setError(new Error('Failed to load budgets'));
      console.error('Failed to load budget', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedMonth]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addCategoryBudget = async (budget: Omit<CategoryBudget, 'id'>): Promise<void> => {
    setIsLoading(true);

    try {
      const newBudget: CategoryBudget = await createCategoryBudget(budget);
      setCategoryBudgets((prev) => [...prev, newBudget]);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editCategoryBudget = async (budget: CategoryBudget): Promise<void> => {
    setIsLoading(true);

    try {
      const updatedBudget: CategoryBudget = await updateCategoryBudget(budget);
      setCategoryBudgets((prev) => prev.map((b) => (b.id === budget.id ? updatedBudget : b)));
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategoryBudget = async (budgetId: string): Promise<void> => {
    setIsLoading(true);

    try {
      await deleteCategoryBudget(budgetId);
      setCategoryBudgets((prev) => prev.filter((budget) => budget.id !== budgetId));
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addGeneralBudget = async (budget: Omit<GeneralBudget, 'id'>): Promise<void> => {
    setIsLoading(true);

    try {
      const newBudget: GeneralBudget = await createGeneralBudget(budget);
      setGeneralBudget(newBudget);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editGeneralBudget = async (budget: GeneralBudget): Promise<void> => {
    setIsLoading(true);

    try {
      const updatedBudget = await updateGeneralBudget(budget);
      setGeneralBudget(updatedBudget);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeGeneralBudget = async (budgetId: string): Promise<void> => {
    setIsLoading(true);

    try {
      await deleteGeneralBudget(budgetId);
      setGeneralBudget(null);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: BudgetContext = {
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
    refetch: fetchBudgets,

    selectedMonth,
    setSelectedMonth,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudget = () => {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error('useBudget() context should be used within BudgetProvider');
  }
  return context;
};

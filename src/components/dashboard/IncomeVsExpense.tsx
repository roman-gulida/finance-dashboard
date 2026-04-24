import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import { type Transaction } from '../../types/types';
import { useMemo } from 'react';
import Loading from '../Loading';
import ErrorDisplay from '../ErrorDisplay';
import { Frown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

type IncomeVsExpenseProps = {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

function IncomeVsExpense({ transactions, isLoading, error, refetch }: IncomeVsExpenseProps) {
  const { theme } = useTheme();

  const data = useMemo(() => {
    const monthMap: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((tx) => {
      const month = tx.timestamp.slice(0, 7);
      if (!monthMap[month]) monthMap[month] = { income: 0, expense: 0 };

      if (tx.type === 'income') monthMap[month].income += tx.amount;
      else if (tx.type === 'expense') monthMap[month].expense += tx.amount;
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, { income, expense }]) => ({
        month,
        difference: income - expense,
      }));
  }, [transactions]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;

  const CHART_COLORS = {
    positive: theme === 'dark' ? '#10b981' : '#16a34a',
    negative: theme === 'dark' ? '#ef4444' : '#dc2626',
    grid: theme === 'dark' ? '#a5b4fc' : '#c7d2fe',
    reference: theme === 'dark' ? '#6366f1' : '#4f46e5',
    text: theme === 'dark' ? '#e0e7ff' : '#312e81',
  };

  return (
    <div className="h-full w-full min-h-0 card-surface p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Income vs Expenses</h2>

      {transactions.length > 0 ? (
        <div className="flex-1 flex items-center justify-center h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: CHART_COLORS.text }} />
              <YAxis tick={{ fontSize: 12, fill: CHART_COLORS.text }} />
              <ReferenceLine y={0} stroke={CHART_COLORS.reference} strokeWidth={2} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1e1b4b' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#4338ca' : '#d1d5db'}`,
                  borderRadius: '8px',
                }}
                labelStyle={{ color: CHART_COLORS.text }}
                itemStyle={{ color: CHART_COLORS.text }}
                cursor={false}
              />
              <Bar dataKey="difference" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.difference >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Frown size={56} className="mb-3 text-primary-400" />
          <p className="text-lg text-primary-400">Add transactions to see income vs expenses.</p>
        </div>
      )}
    </div>
  );
}

export default IncomeVsExpense;

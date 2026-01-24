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

type IncomeVsExpenseProps = {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

function IncomeVsExpense({ transactions, isLoading, error, refetch }: IncomeVsExpenseProps) {
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
        diff: income - expense,
      }));
  }, [transactions]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div className="income-expense-diff">
      <h2>Income VS Expenses difference</h2>

      {transactions.length > 0 ? (
        <ResponsiveContainer width={300} height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ReferenceLine y={0} stroke="#000" />
            <Tooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      className="custom-tooltip"
                      style={{ background: 'white', padding: 8, border: '1px solid #ccc' }}
                    >
                      <p>
                        <strong>Month:</strong> {label}
                      </p>
                      <p>
                        <strong>Difference:</strong> ${payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar dataKey="diff">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.diff >= 0 ? 'green' : 'red'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <>
          <Frown />
          <p>Add a few transactions to see how your income compares to expenses.</p>
        </>
      )}
    </div>
  );
}

export default IncomeVsExpense;

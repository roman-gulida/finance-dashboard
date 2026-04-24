import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Categories } from '../../types/types';
import Loading from '../Loading';
import ErrorDisplay from '../ErrorDisplay';
import { Frown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

type SpendingByCategoryProps = {
  spentByCategory: Record<string, number>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

function SpendingByCategory({
  spentByCategory,
  isLoading,
  error,
  refetch,
}: SpendingByCategoryProps) {
  const { theme } = useTheme();

  const data = Object.entries(spentByCategory)
    .map(([category, amount]) => ({
      name: Categories.find((c) => c.value === category)?.label || category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const CHART_COLORS = {
    light: ['#ef4444', '#3b82f6', '#eab308', '#ec4899', '#10b981', '#f97316', '#8b5cf6'],
    dark: ['#FF2B2B', '#66BFFF', '#FFF14A', '#FF6BB9', '#00E5B4', '#FF5F00', '#0F7D2D'],
  };
  const COLORS = CHART_COLORS[theme];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div className="h-full p-4 card-surface flex flex-col items-center">
      <h2 className="text-xl font-bold mb-6">Spending by category</h2>
      {Object.keys(spentByCategory).length > 0 ? (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={110}
                labelLine={false}
                dataKey="value"
                stroke="none"
                className="outline-none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip cursor={false} />
            </PieChart>
          </ResponsiveContainer>

          <ul className="list-disc pl-6 space-y-2">
            {data.map((item, index) => {
              const percentage = total ? ((item.value / total) * 100).toFixed(0) : 0;

              return (
                <li key={item.name} className="flex items-center justify-between space-x-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>{percentage}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center py-12 text-center">
          <Frown size={56} className="mb-2 text-primary-400" />
          <p className="text-lg text-primary-400">
            No transactions yet this month. Add your first one to see insights.
          </p>
        </div>
      )}
    </div>
  );
}

export default SpendingByCategory;

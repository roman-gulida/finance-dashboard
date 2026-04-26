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

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay error={error} onRetry={refetch} />;

  return (
    <div className="h-full p-4 sm:p-6 card-surface flex flex-col items-center">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center">
        Spending by category
      </h2>
      {Object.keys(spentByCategory).length > 0 ? (
        <div className="flex flex-row sm:flex-row items-center gap-4 w-full">
          <div className="shrink-0">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  labelLine={false}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip cursor={false} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="flex-1 list-disc pl-6 space-y-1 sm:space-y-2 text-sm sm:text-base">
            {data.map((item, index) => {
              const percentage = total ? ((item.value / total) * 100).toFixed(0) : 0;

              return (
                <li key={item.name} className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="shrink-0">{percentage}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <Frown size={56} className="mb-2 text-primary-400" />
          <p className="text-sm sm:text-lg text-primary-400">
            No transactions yet this month. Add your first one to see insights.
          </p>
        </div>
      )}
    </div>
  );
}

export default SpendingByCategory;

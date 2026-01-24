import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Categories } from '../../types/types';
import Loading from '../Loading';
import ErrorDisplay from '../ErrorDisplay';
import { Frown } from 'lucide-react';

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
  const data = Object.entries(spentByCategory).map(([category, amount]) => ({
    name: Categories.find((c) => c.value === category)?.label || category,
    value: amount,
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div className="spending-by-category">
      <h1>Spending by category</h1>
      {Object.keys(spentByCategory).length > 0 ? (
        <>
          <ResponsiveContainer width={250} height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip cursor={false} />
            </PieChart>
          </ResponsiveContainer>

          <ul>
            {data.map((item) => {
              const percentage = total ? ((item.value / total) * 100).toFixed(0) : 0;

              return (
                <li key={item.name}>
                  <span>{item.name} </span>
                  <span>{percentage}%</span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <Frown />
          <p>No transactions yet. Add your first one to see insights.</p>
        </>
      )}
    </div>
  );
}

export default SpendingByCategory;

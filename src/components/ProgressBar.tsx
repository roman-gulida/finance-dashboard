import { getBudgetStatus } from '../utils/utils';

type ProgressBarProps = {
  percentage: number;
};

function ProgressBar({ percentage }: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  const barColor = getBudgetStatus(clampedPercentage).color;

  const colorClasses = {
    green: 'bg-green-600 dark:bg-green-500',
    yellow: 'bg-yellow-600 dark:bg-yellow-500',
    red: 'bg-red-600 dark:bg-red-500',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-primary-400/60 dark:bg-primary-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[barColor]} transition-all duration-300`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      <span className="text-xs text-primary-700 dark:text-primary-300 min-w-5 text-right">
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}

export default ProgressBar;

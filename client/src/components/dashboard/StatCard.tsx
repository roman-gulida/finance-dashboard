type StatCardTitle = 'Income' | 'Expenses' | 'Budget';

type StatCardProps = {
  title: StatCardTitle;
  value: string;
  subtext?: string;
};

const titleClasses = {
  Income: 'text-green-600 dark:text-green-500',
  Expenses: 'text-red-600 dark:text-red-500',
  Budget: 'text-primary-600 dark:text-primary-400',
};

function StatCard({ title, value, subtext }: StatCardProps) {
  return (
    <div className="w-full px-4 py-4 sm:py-5 card-surface card-interactive flex flex-col text-center gap-1">
      <h4 className="text-lg sm:text-lg text-highlight">{title}</h4>
      <p className={`text-xl sm:text-2xl font-bold ${titleClasses[title]}`}>{value}</p>
      <span className="text-xs sm:text-sm text-highlight">{subtext}</span>
    </div>
  );
}

export default StatCard;

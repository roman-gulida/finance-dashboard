type StatCardTitle = 'Income' | 'Expenses' | 'Budget';

type StatCardProps = {
  title: StatCardTitle;
  value: string;
  subtext?: string;
};

const titleClasses = {
  Income: 'text-green-600 dark:text-green-500',
  Expenses: 'text-red-600 text-red-500',
  Budget: '',
};

function StatCard({ title, value, subtext }: StatCardProps) {
  return (
    <div className="h-30 w-40 px-2 py-4 card-surface card-interactive flex flex-col text-center gap-0.5">
      <h4 className="text-lg text-highlight">{title}</h4>
      <p className={`text-xl font-bold ${titleClasses[title]}`}>{value}</p>
      <span className="text-sm text-highlight">{subtext}</span>
    </div>
  );
}

export default StatCard;

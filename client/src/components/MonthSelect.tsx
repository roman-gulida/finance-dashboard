import { ChevronDown } from 'lucide-react';

type MonthSelectProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  includeAllOption?: boolean;
};

function MonthSelect({ value, onChange, includeAllOption = true }: MonthSelectProps) {
  const generateMonthOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const value = `${year}-${month}`;
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      options.push(
        <option key={value} value={value}>
          {label}
        </option>,
      );
    }

    return options;
  };

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="form-input w-45 h-10 py-2 px-3 border-2 cursor-pointer appearance-none"
      >
        {includeAllOption && <option value="">All time</option>}
        {generateMonthOptions()}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  );
}

export default MonthSelect;

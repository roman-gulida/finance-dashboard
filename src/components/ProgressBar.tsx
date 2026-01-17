import '../styles/progressbar.css';
import { getBudgetStatus } from '../utils/utils';

type ProgressBarProps = {
  percentage: number;
};

function ProgressBar({ percentage }: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const barColor = getBudgetStatus(clampedPercentage).color;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className={`progress-fill ${barColor}`} style={{ width: `${clampedPercentage}%` }} />
      </div>
      <span className="progress-label">{clampedPercentage.toFixed(0)}%</span>
    </div>
  );
}

export default ProgressBar;

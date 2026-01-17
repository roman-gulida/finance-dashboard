import { OctagonAlert } from 'lucide-react';

type ErrorDisplayProps = {
  error: Error | null;
  onRetry?: () => void;
};

function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div>
      <div>
        <OctagonAlert />
        <p>⚠️ Something went wrong</p>
        <p>{error.message}</p>
      </div>
      {onRetry && <button onClick={onRetry}>Try Again</button>}
    </div>
  );
}

export default ErrorDisplay;

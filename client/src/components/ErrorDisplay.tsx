import { OctagonAlert } from 'lucide-react';

type ErrorDisplayProps = {
  error: Error | null;
  onRetry?: () => void;
};

function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800 rounded-2xl p-6 text-center">
        <OctagonAlert size={56} className="mx-auto mb-4 text-red-600 dark:text-red-400" />
        <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold rounded-2xl transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;

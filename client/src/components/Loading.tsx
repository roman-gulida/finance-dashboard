import { Loader } from 'lucide-react';

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader size={48} className="animate-spin text-primary-500 dark:text-primary-400 mb-4" />
      <p className="text-lg font-medium text-primary-600 dark:text-primary-400">Loading...</p>
    </div>
  );
}

export default Loading;

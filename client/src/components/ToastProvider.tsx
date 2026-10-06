import { Toaster } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: theme === 'dark' ? 'var(--color-primary-900)' : 'var(--color-primary-100)',
          color: theme === 'dark' ? 'var(--color-primary-50)' : 'var(--color-primary-950)',
          border: `2px solid ${theme === 'dark' ? 'var(--color-primary-700)' : 'var(--color-primary-300)'}`,
          borderRadius: '1rem',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow:
            theme === 'dark' ? '0 10px 25px rgba(0, 0, 0, 0.5)' : '0 10px 25px rgba(0, 0, 0, 0.1)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: theme === 'dark' ? '#10b981' : '#16a34a',
            secondary: theme === 'dark' ? '#1e1b4b' : '#fff',
          },
          style: {
            border: `2px solid ${theme === 'dark' ? '#10b981' : '#16a34a'}`,
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: theme === 'dark' ? '#ef4444' : '#dc2626',
            secondary: theme === 'dark' ? '#1e1b4b' : '#fff',
          },
          style: {
            border: `2px solid ${theme === 'dark' ? '#ef4444' : '#dc2626'}`,
          },
        },
      }}
    />
  );
}

export default ToastProvider;

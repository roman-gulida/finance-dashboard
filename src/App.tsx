import MainLayout from './components/layout/MainLayout';
import { PrivateRoute } from './components/layout/PrivateRoute';
import { PublicRoute } from './components/layout/PublicRoute';
import { AuthProvider } from './contexts/AuthContext';
import CategoryBudget from './pages/Budget';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<CategoryBudget />} />
          </Route>
          <Route
            path="/sign_in"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/sign_up"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
        <ToastProvider />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

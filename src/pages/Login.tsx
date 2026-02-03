import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import AuthForm from '../components/auth/AuthForm';
import type { UserCredentials } from '../types/types';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async ({ username, password }: UserCredentials) => {
    try {
      await login({ username, password });
      toast.success(`You are logged in as ${username}`);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen -mt-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl text-highlight font-bold mb-5">Finance Dashboard</h1>
      <h3 className="text-2xl mb-4">Welcome back!</h3>
      <AuthForm buttonText="Sign in" onSubmit={handleLogin} />
      <p className="mt-3">
        Don't have an account?{' '}
        <Link to="/sign_up" className="text-highlight font-semibold hover:text-primary-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;

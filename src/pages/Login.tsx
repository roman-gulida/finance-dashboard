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
    <div className="auth-wrapper">
      <h1>Welcome back!</h1>
      <AuthForm buttonText="Sign in" onSubmit={handleLogin} />
      <h4>
        Don't have an account? <Link to="/sign_up">Sign up</Link>
      </h4>
    </div>
  );
}

export default Login;

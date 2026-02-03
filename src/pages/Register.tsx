import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import type { UserCredentials } from '../types/types';
import AuthForm from '../components/auth/AuthForm';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async ({ username, password }: UserCredentials) => {
    try {
      await register({ username, password });
      toast.success(`You are registered successfully as ${username}`);
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
      <h3 className="text-2xl mb-4">Create an account</h3>
      <AuthForm buttonText="Sign up" onSubmit={handleRegister} />
      <p className="mt-3">
        Already have an account?{' '}
        <Link to="/sign_in" className="text-highlight font-semibold hover:text-primary-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Register;

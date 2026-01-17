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
    <div className="auth-wrapper">
      <h1>Create an account</h1>
      <AuthForm buttonText="Sign up" onSubmit={handleRegister} />
      <h4>
        Already have an account? <Link to="/sign_in">Sign in</Link>
      </h4>
    </div>
  );
}

export default Register;

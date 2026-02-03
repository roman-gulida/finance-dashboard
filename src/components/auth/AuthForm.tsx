import { useRef, useState } from 'react';
import type { UserCredentials } from '../../types/types';
import { Eye, EyeClosed } from 'lucide-react';

type AuthFormProps = {
  buttonText: string;
  onSubmit: ({ username, password }: UserCredentials) => Promise<void>;
};

type ValidatingError = string | null;

function AuthForm({ buttonText, onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<ValidatingError>(null);
  const [passwordError, setPasswordError] = useState<ValidatingError>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const usernameErr = validateUsername(username);
      const passwordErr = validatePassword(password);

      setUsernameError(usernameErr);
      setPasswordError(passwordErr);

      if (!usernameErr && !passwordErr) {
        await onSubmit({ username, password });
      }
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateUsername = (username: string): ValidatingError => {
    const startsWithLower = /^[a-z]/.test(username);
    const onlyLowerAndDigits = /^[a-z0-9]+$/.test(username);
    const validLength = username.length >= 3 && username.length <= 15;

    if (!username) return null;
    if (!startsWithLower) return 'Username must start with a lowercase letter.';
    if (!onlyLowerAndDigits) return 'Only lowercase letters and digits are allowed.';
    if (!validLength) return 'Length must be between 3 and 15 characters.';
    return null;
  };

  const validatePassword = (password: string): ValidatingError => {
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*._+\-=]/.test(password);
    const validLength = password.length >= 6 && password.length <= 15;

    if (!password) return null;
    if (!hasUpper) return 'Must contain at least one uppercase letter.';
    if (!hasDigit) return 'Must contain at least one digit.';
    if (!hasSpecial) return 'Must contain at least one special character.';
    if (!validLength) return 'Length must be between 6 and 15 characters.';
    return null;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameError(null);
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError(null);
    setPassword(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
      <div className="mb-3 flex flex-col justify-center items-center">
        <input
          type="text"
          className="form-input outline-none"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          onBlur={() => setUsernameError(validateUsername(username))}
        />
        <p className="h-6 text-red-500">{usernameError || ''}</p>
      </div>
      <div className="flex flex-col items-center">
        <div
          className="form-input flex items-center cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <input
            type={showPassword ? 'text' : 'password'}
            className="outline-none border-none placeholder:text-primary-900/50 dark:placeholder:text-primary-100/50"
            placeholder="Password"
            value={password}
            ref={inputRef}
            onChange={handlePasswordChange}
            onBlur={() => setPasswordError(validatePassword(password))}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="ml-6 w-10 h-7 flex justify-center items-center hover:bg-primary-300/50 rounded-2xl"
          >
            {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
        </div>
        <p className="h-6 text-red-500">{passwordError || ''}</p>
      </div>
      <button
        type="submit"
        className="h-10 w-30 mt-5 flex justify-center items-center rounded-3xl
         text-primary-950 bg-primary-400 hover:bg-primary-200 transition-all hover:scale-98 duration-200 ease-out"
        disabled={
          !username || !password || usernameError !== null || passwordError !== null || isSubmitting
        }
      >
        {isSubmitting ? 'Loading...' : buttonText}
      </button>
    </form>
  );
}

export default AuthForm;

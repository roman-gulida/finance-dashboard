import { useState } from 'react';
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
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          onBlur={() => setUsernameError(validateUsername(username))}
        />
        {usernameError && <div className="error">{usernameError}</div>}
      </div>
      <div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => setPasswordError(validatePassword(password))}
        />
        <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
          {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
        </button>
        {passwordError && <div className="error">{passwordError}</div>}
      </div>
      <button
        type="submit"
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

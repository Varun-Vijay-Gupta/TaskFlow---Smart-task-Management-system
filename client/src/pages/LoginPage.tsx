import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, ArrowRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

type AuthMode = 'signin' | 'signup' | 'guest';

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, loginAsGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const resetForm = () => {
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setGuestName('');
  };

  const switchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginAsGuest(guestName.trim() || undefined);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login as guest');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
              <p className="text-primary-100 text-sm">Smart Task Management</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Organize your work,
            <br />
            achieve your goals
          </h2>
          <p className="text-primary-100 text-lg max-w-md mb-10">
            Streamline your workflow with intelligent task management.
            Track progress, set priorities, and never miss a deadline.
          </p>

          <div className="space-y-4">
            {[
              'Sign up to save tasks permanently',
              'Filter, sort, and search effortlessly',
              'Light & dark themes for comfortable viewing',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="text-white/90 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-bg-light dark:bg-bg-dark">
        <div className="flex justify-end p-4 md:p-6">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  TaskFlow
                </h1>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Smart Task Management
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
              {mode === 'signin'
                ? 'Welcome back'
                : mode === 'signup'
                  ? 'Create an account'
                  : 'Continue as guest'}
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              {mode === 'signin'
                ? 'Sign in to access your tasks'
                : mode === 'signup'
                  ? 'Sign up to save your tasks permanently'
                  : 'Try TaskFlow without creating an account'}
            </p>

            <div className="flex gap-1 p-1 mb-6 rounded-xl bg-gray-100 dark:bg-slate-800">
              {(
                [
                  { id: 'signin' as const, label: 'Sign In' },
                  { id: 'signup' as const, label: 'Sign Up' },
                  { id: 'guest' as const, label: 'Guest' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => switchMode(tab.id)}
                  className={clsx(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    mode === tab.id
                      ? 'bg-surface-light dark:bg-surface-dark text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                {error && <ErrorBox message={error} />}
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Sign In
                </Button>
              </form>
            )}

            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {error && <ErrorBox message={error} />}
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Create Account
                </Button>
              </form>
            )}

            {mode === 'guest' && (
              <form onSubmit={handleGuestLogin} className="space-y-4">
                <Input
                  label="Display Name (Optional)"
                  placeholder="Enter your name or leave blank"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  hint="A random guest name will be assigned if left blank"
                />
                {error && <ErrorBox message={error} />}
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Continue as Guest
                </Button>
                <p className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Guest sessions are temporary. Sign up to keep your tasks permanently.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-danger">
      {message}
    </div>
  );
}

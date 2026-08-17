import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginAsGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
      {/* Left Panel - Illustration */}
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
              'Track tasks with real-time status updates',
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

          {/* Decorative task cards illustration */}
          <div className="mt-12 relative">
            <div className="absolute -rotate-6 w-72 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="h-2 w-24 rounded bg-white/30" />
              </div>
              <div className="h-2 w-full rounded bg-white/20 mb-1.5" />
              <div className="h-2 w-3/4 rounded bg-white/15" />
            </div>
            <div className="relative rotate-3 ml-8 mt-8 w-72 p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="h-2 w-32 rounded bg-white/40" />
              </div>
              <div className="h-2 w-full rounded bg-white/25 mb-1.5" />
              <div className="h-2 w-2/3 rounded bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col bg-bg-light dark:bg-bg-dark">
        <div className="flex justify-end p-4 md:p-6">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
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
              Welcome back
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
              Sign in to manage your tasks or continue as a guest
            </p>

            <form onSubmit={handleGuestLogin} className="space-y-5">
              <Input
                label="Display Name (Optional)"
                placeholder="Enter your name or leave blank"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                hint="A random guest name will be assigned if left blank"
              />

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-danger">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full"
                rightIcon={<ArrowRight size={18} />}
              >
                Continue as Guest
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Guest sessions are temporary. Your tasks are saved while you&apos;re logged in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/taskHelpers';
import clsx from 'clsx';

interface HeaderProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-4 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-text-secondary-light dark:text-text-secondary-dark hidden sm:block">
            Manage and track your tasks efficiently
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-text-secondary-light" />
          ) : (
            <Sun size={18} className="text-text-secondary-dark" />
          )}
        </button>

        {user && (
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 border-l border-border-light dark:border-border-dark">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs md:text-sm font-semibold">
              {getInitials(user.name)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                {user.name}
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {user.isGuest ? 'Guest User' : 'Member'}
              </p>
            </div>
            <button
              onClick={logout}
              className="text-xs md:text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-danger transition-colors cursor-pointer ml-1"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'tasks', label: 'My Tasks', icon: '✅' },
];

export function Sidebar({ isOpen, onClose, activeNav }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col',
          'bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark',
          'transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border-light dark:border-border-dark">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
            <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              TaskFlow
            </h2>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Smart Task Management
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={onClose}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer',
                activeNav === item.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-slate-800'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

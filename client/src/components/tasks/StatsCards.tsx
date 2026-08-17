import clsx from 'clsx';
import type { TaskStats } from '../../types';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: TaskStats;
  activeFilter: string;
  onFilterChange: (status: string) => void;
}

const cards = [
  {
    key: 'total',
    label: 'Total Tasks',
    icon: ListTodo,
    color: 'text-primary-500',
    bg: 'bg-primary-50 dark:bg-primary-900/20',
    filter: 'all',
  },
  {
    key: 'todo',
    label: 'To Do',
    icon: Clock,
    color: 'text-text-secondary-light dark:text-text-secondary-dark',
    bg: 'bg-gray-50 dark:bg-slate-800',
    filter: 'todo',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    icon: TrendingUp,
    color: 'text-warning',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    filter: 'in_progress',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-green-50 dark:bg-green-900/20',
    filter: 'completed',
  },
] as const;

export function StatsCards({ stats, activeFilter, onFilterChange }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const count = stats[card.key as keyof TaskStats];
        const isActive = activeFilter === card.filter;

        return (
          <button
            key={card.key}
            onClick={() => onFilterChange(card.filter)}
            className={clsx(
              'flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left',
              'bg-surface-light dark:bg-surface-dark',
              isActive
                ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-sm'
                : 'border-border-light dark:border-border-dark hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm'
            )}
          >
            <div
              className={clsx(
                'w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0',
                card.bg
              )}
            >
              <Icon size={20} className={card.color} />
            </div>
            <div>
              <p className="text-xs md:text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {card.label}
              </p>
              <p className="text-xl md:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                {count}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

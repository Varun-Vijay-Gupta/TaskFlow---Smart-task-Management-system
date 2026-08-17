import { useState } from 'react';
import { Calendar, Edit2, Trash2, User, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import type { Task, TaskStatus } from '../../types';
import { Badge } from '../ui/Badge';
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  getStatusVariant,
  getPriorityVariant,
  formatDate,
  isOverdue,
} from '../../utils/taskHelpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  isUpdating?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isUpdating,
}: TaskCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);

  const statusOptions: TaskStatus[] = ['todo', 'in_progress', 'completed'];

  return (
    <div
      className={clsx(
        'group relative p-4 md:p-5 rounded-2xl border transition-all duration-200',
        'bg-surface-light dark:bg-surface-dark',
        'border-border-light dark:border-border-dark',
        'hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md',
        isUpdating && 'opacity-60 pointer-events-none',
        task.status === 'completed' && 'opacity-75'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={getPriorityVariant(task.priority)}>
              {PRIORITY_LABELS[task.priority]}
            </Badge>
            <Badge variant={getStatusVariant(task.status)}>
              {STATUS_LABELS[task.status]}
            </Badge>
          </div>

          <h3
            className={clsx(
              'text-base font-semibold text-text-primary-light dark:text-text-primary-dark mb-1',
              task.status === 'completed' && 'line-through'
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            <span
              className={clsx(
                'flex items-center gap-1',
                overdue && 'text-danger font-medium'
              )}
            >
              <Calendar size={14} />
              {formatDate(task.dueDate)}
              {overdue && ' (Overdue)'}
            </span>
            {task.assignee && (
              <span className="flex items-center gap-1">
                <User size={14} />
                {task.assignee}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Change status"
            >
              <ChevronDown size={16} />
            </button>
            {showStatusMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStatusMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-40 py-1 rounded-xl border bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark shadow-lg">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onStatusChange(task._id, status);
                        setShowStatusMenu(false);
                      }}
                      className={clsx(
                        'w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer',
                        task.status === status &&
                          'text-primary-500 font-medium'
                      )}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-danger transition-colors cursor-pointer"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

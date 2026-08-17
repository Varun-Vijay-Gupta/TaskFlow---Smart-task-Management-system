import type { TaskPriority, TaskStatus } from '../types';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export function getStatusVariant(
  status: TaskStatus
): 'default' | 'info' | 'warning' | 'success' {
  switch (status) {
    case 'todo':
      return 'default';
    case 'in_progress':
      return 'warning';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
}

export function getPriorityVariant(
  priority: TaskPriority
): 'default' | 'info' | 'warning' | 'danger' {
  switch (priority) {
    case 'low':
      return 'info';
    case 'medium':
      return 'warning';
    case 'high':
      return 'danger';
    default:
      return 'default';
  }
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'No due date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isOverdue(dateStr?: string, status?: TaskStatus): boolean {
  if (!dateStr || status === 'completed') return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export function toInputDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

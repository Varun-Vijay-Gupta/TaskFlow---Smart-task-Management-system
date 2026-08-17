export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  completed: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; path: string }>;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
}

export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';
export type StatusFilter = TaskStatus | 'all';

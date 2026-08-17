import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type {
  Task,
  TaskFormData,
  TaskStats,
  TaskStatus,
  SortBy,
  SortOrder,
} from '../types';

const defaultStats: TaskStats = {
  total: 0,
  todo: 0,
  in_progress: 0,
  completed: 0,
};

export function useTasks(initialStatusFilter = 'all') {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.getTasks({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy,
        sortOrder,
        search: search || undefined,
      });
      setTasks(response.data.tasks);
      setStats(response.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, sortBy, sortOrder, search]);

  useEffect(() => {
    const debounce = setTimeout(fetchTasks, search ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [fetchTasks, search]);

  const handleCreateOrUpdate = async (data: TaskFormData) => {
    const payload = {
      ...data,
      dueDate: data.dueDate || undefined,
      assignee: data.assignee || undefined,
      description: data.description || undefined,
    };

    if (editingTask) {
      await api.updateTask(editingTask._id, payload);
      showToast('Task updated successfully');
    } else {
      await api.createTask(payload);
      showToast('Task created successfully');
    }
    await fetchTasks();
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    setUpdatingId(id);
    try {
      await api.updateTaskStatus(id, status);
      showToast('Status updated');
      await fetchTasks();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to update status',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setUpdatingId(id);
    try {
      await api.deleteTask(id);
      showToast('Task deleted');
      await fetchTasks();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete task',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return {
    tasks,
    stats,
    isLoading,
    error,
    updatingId,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    modalOpen,
    editingTask,
    toast,
    fetchTasks,
    handleCreateOrUpdate,
    handleStatusChange,
    handleDelete,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}

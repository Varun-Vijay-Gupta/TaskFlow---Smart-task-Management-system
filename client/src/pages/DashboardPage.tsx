import { useState, useEffect, useCallback } from 'react';
import { ListTodo } from 'lucide-react';
import { Header, Sidebar } from '../components/layout/Layout';
import { StatsCards } from '../components/tasks/StatsCards';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { EmptyState, LoadingSpinner, ErrorState } from '../components/ui/States';
import { Button } from '../components/ui/Button';
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

export function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
      showToast(err instanceof Error ? err.message : 'Failed to update status', 'error');
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
      showToast(err instanceof Error ? err.message : 'Failed to delete task', 'error');
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

  return (
    <div className="min-h-screen flex bg-bg-light dark:bg-bg-dark">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav="dashboard"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />

        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto scrollbar-thin">
          <StatsCards
            stats={stats}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />

          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-4 md:p-6">
            <TaskFilters
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              onAddTask={openCreateModal}
            />

            <div className="mt-6">
              {isLoading ? (
                <LoadingSpinner className="py-16" />
              ) : error ? (
                <ErrorState message={error} onRetry={fetchTasks} />
              ) : tasks.length === 0 ? (
                <EmptyState
                  icon={<ListTodo size={32} />}
                  title="No tasks found"
                  description={
                    search || statusFilter !== 'all'
                      ? 'Try adjusting your filters or search query'
                      : 'Get started by creating your first task'
                  }
                  action={
                    !search && statusFilter === 'all' ? (
                      <Button onClick={openCreateModal}>Create Your First Task</Button>
                    ) : undefined
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                      isUpdating={updatingId === task._id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
      />

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in slide-in-from-bottom-4 duration-300 ${
            toast.type === 'success' ? 'bg-success' : 'bg-danger'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

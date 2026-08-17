import { ListTodo } from 'lucide-react';
import { StatsCards } from '../components/tasks/StatsCards';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { EmptyState, LoadingSpinner, ErrorState } from '../components/ui/States';
import { Button } from '../components/ui/Button';
import { useTasks } from '../hooks/useTasks';

export function DashboardPage() {
  const {
    tasks,
    stats,
    isLoading,
    error,
    updatingId,
    statusFilter,
    setStatusFilter,
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
  } = useTasks();

  const recentTasks = tasks.slice(0, 6);

  return (
    <div className="space-y-6">
      <StatsCards
        stats={stats}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            Recent Tasks
          </h2>
          <Button size="sm" onClick={openCreateModal}>
            Add Task
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchTasks} />
        ) : recentTasks.length === 0 ? (
          <EmptyState
            icon={<ListTodo size={32} />}
            title="No tasks yet"
            description="Create your first task to get started"
            action={<Button onClick={openCreateModal}>Create Task</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentTasks.map((task) => (
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

      <TaskFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
      />

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${
            toast.type === 'success' ? 'bg-success' : 'bg-danger'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

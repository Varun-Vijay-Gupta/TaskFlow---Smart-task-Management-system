import { ListTodo } from 'lucide-react';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { EmptyState, LoadingSpinner, ErrorState } from '../components/ui/States';
import { Button } from '../components/ui/Button';
import { useTasks } from '../hooks/useTasks';

export function MyTasksPage() {
  const {
    tasks,
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
  } = useTasks();

  return (
    <div className="space-y-6">
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

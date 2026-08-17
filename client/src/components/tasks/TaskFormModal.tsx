import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Task, TaskFormData } from '../../types';
import { PRIORITY_OPTIONS } from '../../utils/taskHelpers';
import { toInputDate } from '../../utils/taskHelpers';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  task?: Task | null;
}

const emptyForm: TaskFormData = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  assignee: '',
};

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  task,
}: TaskFormModalProps) {
  const [form, setForm] = useState<TaskFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: toInputDate(task.dueDate),
        assignee: task.assignee || '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    if (!form.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof TaskFormData>(
    key: K,
    value: TaskFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="Enter task title"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          placeholder="Enter task description (optional)"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            options={[
              { value: 'todo', label: 'To Do' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
            value={form.status}
            onChange={(e) =>
              updateField('status', e.target.value as TaskFormData['status'])
            }
          />
          <Select
            label="Priority"
            options={PRIORITY_OPTIONS}
            value={form.priority}
            onChange={(e) =>
              updateField('priority', e.target.value as TaskFormData['priority'])
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => updateField('dueDate', e.target.value)}
          />
          <Input
            label="Assignee"
            placeholder="Enter assignee name"
            value={form.assignee}
            onChange={(e) => updateField('assignee', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

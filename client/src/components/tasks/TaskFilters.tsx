import { Search, Plus, SlidersHorizontal } from 'lucide-react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { SORT_OPTIONS, STATUS_OPTIONS } from '../../utils/taskHelpers';
import type { SortBy, SortOrder } from '../../types';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  onAddTask: () => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onAddTask,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark"
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors"
          />
        </div>
        <Button
          onClick={onAddTask}
          leftIcon={<Plus size={18} />}
          className="shrink-0"
        >
          Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
          <SlidersHorizontal size={16} />
          <span className="font-medium">Filters:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <Select
            label=""
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by status"
          />
          <Select
            label=""
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            aria-label="Sort by"
          />
          <Select
            label=""
            options={[
              { value: 'desc', label: 'Descending' },
              { value: 'asc', label: 'Ascending' },
            ]}
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
            aria-label="Sort order"
          />
        </div>
      </div>
    </div>
  );
}

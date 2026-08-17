import clsx from 'clsx';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl border bg-surface-light dark:bg-surface-dark',
          'text-text-primary-light dark:text-text-primary-dark',
          'border-border-light dark:border-border-dark',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200 cursor-pointer',
          error && 'border-danger focus:ring-danger/40 focus:border-danger',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl border bg-surface-light dark:bg-surface-dark',
          'text-text-primary-light dark:text-text-primary-dark',
          'border-border-light dark:border-border-dark',
          'placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed resize-none',
          'transition-colors duration-200',
          error && 'border-danger focus:ring-danger/40 focus:border-danger',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

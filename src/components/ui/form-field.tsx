import type { ReactNode } from "react";

export type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  count: number;
  max: number;
  error?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  required,
  count,
  max,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label} {required ? <span className="text-danger">*</span> : null}
        </label>
        <span
          className={`font-mono text-xs ${count > max ? "text-danger" : "text-subtle"}`}
        >
          {count}/{max}
        </span>
      </div>
      {children}
      {error ? (
        <span id={`${id}-error`} className="text-[13px] text-danger">
          {error}
        </span>
      ) : null}
    </div>
  );
}

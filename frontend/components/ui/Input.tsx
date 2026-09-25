"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function FieldShell({
  label,
  error,
  hint,
  required,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

const baseInputClasses =
  "h-12 w-full rounded-lg border bg-white px-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-200 disabled:bg-slate-50 disabled:text-slate-400";

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperProps & { icon?: React.ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = "", icon, ...props }, ref) => (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          ref={ref}
          className={`${baseInputClasses} ${icon ? "pr-10" : ""} ${
            error ? "border-red-300 focus:ring-red-200" : "border-slate-300"
          } ${className}`}
          {...props}
        />
      </div>
    </FieldShell>
  )
);
Input.displayName = "Input";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & FieldWrapperProps;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, className = "", children, ...props }, ref) => (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        className={`${baseInputClasses} ${error ? "border-red-300 focus:ring-red-200" : "border-slate-300"} ${className}`}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  )
);
Select.displayName = "Select";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapperProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className = "", ...props }, ref) => (
    <FieldShell label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        className={`min-h-[110px] w-full rounded-lg border bg-white px-3.5 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-200 ${
          error ? "border-red-300 focus:ring-red-200" : "border-slate-300"
        } ${className}`}
        {...props}
      />
    </FieldShell>
  )
);
Textarea.displayName = "Textarea";

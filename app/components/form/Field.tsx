"use client";

import { createContext, useContext, useId } from "react";
import clsx from "clsx";

interface FieldContextValue {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return useContext(FieldContext);
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  labelHidden?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Field({
  label,
  hint,
  error,
  labelHidden = false,
  htmlFor,
  children,
  className,
}: FieldProps) {
  const autoId = useId();
  const id = htmlFor ?? autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: !!error }}>
      <div className={clsx("flex flex-col gap-2", className)}>
        <label
          htmlFor={id}
          className={clsx(
            "text-sm font-medium text-gray-900",
            labelHidden && "sr-only",
          )}
        >
          {label}
        </label>

        {children}

        {hint && !error && (
          <p id={hintId} className="text-xs leading-[150%] text-gray-500">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-[13px] text-red-600">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

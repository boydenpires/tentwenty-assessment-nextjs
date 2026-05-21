import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";
import { useFieldContext } from "./Field";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: SelectProps) {
  const field = useFieldContext();

  return (
    <div className="relative">
      <select
        id={field?.id}
        aria-invalid={field?.invalid || undefined}
        aria-describedby={field?.describedBy}
        {...props}
        className={clsx(
          "appearance-none pr-8",
          field?.invalid && "border-red-500 focus:ring-red-500",
          className,
        )}
      >
        {children}
      </select>

      <span
        aria-hidden="true"
        className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-gray-500 select-none"
      >
        expand_more
      </span>
    </div>
  );
}

import clsx from "clsx";
import { useFieldContext } from "./Field";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  const field = useFieldContext();
  return (
    <input
      id={field?.id}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
      {...props}
      className={clsx(
        "px-4 py-3 border rounded-lg text-sm leading-[125%] placeholder:text-gray-500 text-gray-900",
        field?.invalid
          ? "border-red-500 focus:outline-red-500"
          : "border-gray-300",
        className
      )}
    />
  );
}

import clsx from "clsx";
import { useFieldContext } from "./Field";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: TextareaProps) {
  const field = useFieldContext();
  return (
    <textarea
      id={field?.id}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
      {...props}
      className={clsx(
        "w-full text-sm leading-[150%] text-gray-900 placeholder-gray-500 border rounded-lg px-4 py-3 resize-none",
        field?.invalid
          ? "border-red-500 focus:outline-red-500"
          : "border-gray-300",
        className
      )}
    />
  );
}

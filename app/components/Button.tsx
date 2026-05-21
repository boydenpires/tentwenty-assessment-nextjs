import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "w-full px-5 py-2.5 text-[14px] font-medium leading-[150%] rounded-lg transition-colors",
        {
          "bg-primary-700 text-white hover:bg-primary-800 cursor-pointer":
            variant === "primary" && !props.disabled,
          "border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer":
            variant === "secondary" && !props.disabled,
          "bg-primary-600 opacity-40 text-white cursor-not-allowed":
            props.disabled,
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

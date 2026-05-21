interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export default function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        className="size-4 rounded-sm border-[0.5px] border-gray-300 bg-gray-50"
        {...props}
      />
      <label
        className="text-[14px] font-medium leading-3.5 text-gray-500"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  )
}

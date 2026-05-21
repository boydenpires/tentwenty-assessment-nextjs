"use client";

import { useFieldContext } from "./Field";

interface HoursStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

export default function HoursStepper({
  value,
  onChange,
  min = 1,
}: HoursStepperProps) {
  const field = useFieldContext();
  return (
    <div
      className="w-fit h-[37px] flex items-center border border-gray-300 rounded-lg overflow-hidden"
      role="group"
      aria-describedby={field?.describedBy}
    >
      <button
        id={field?.id}
        type="button"
        aria-label="Decrease hours"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8.5 h-full grid place-items-center bg-gray-100 hover:bg-gray-300 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]!">remove</span>
      </button>

      <div
        aria-label={`${value} hours`}
        className="w-[47px] h-full grid place-items-center text-sm leading-[150%] text-gray-500 border-x border-gray-300"
      >
        {value}
      </div>

      <button
        type="button"
        aria-label="Increase hours"
        onClick={() => onChange(value + 1)}
        className="w-8.5 h-full grid place-items-center bg-gray-100 hover:bg-gray-300 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]!">add</span>
      </button>
    </div>
  );
}

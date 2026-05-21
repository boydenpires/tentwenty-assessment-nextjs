interface HoursProgressProps {
  logged: number;
  total: number;
}

export default function HoursProgress({ logged, total }: HoursProgressProps) {
  const percentage = Math.min(Math.round((logged / total) * 100), 100);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="w-full flex justify-between">
        <span className="text-sm leading-[150%] font-medium text-gray-900">
          {logged}/{total} hrs
        </span>
        <span className="text-xs leading-[150%] font-medium text-gray-500">
          {percentage}%
        </span>
      </div>

      <div className="w-47 h-1.5 bg-gray-200 rounded-sm">
        <div
          className="h-full bg-orange-400 rounded-sm transition-all"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={logged}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${logged} of ${total} hours logged`}
        />
      </div>
    </div>
  );
}

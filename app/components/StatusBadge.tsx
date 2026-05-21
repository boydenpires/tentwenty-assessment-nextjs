import type { Status } from '@/app/types'

const statusStyles: Record<Status, string> = {
  completed: 'bg-green-100 text-green-800',
  incomplete: 'bg-yellow-100 text-yellow-800',
  missing: 'bg-pink-100 text-pink-800',
}

interface StatusBadgeProps {
  status: Status
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium uppercase leading-[150%] ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

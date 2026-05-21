interface ProjectBadgeProps {
  name: string;
}

export default function ProjectBadge({ name }: ProjectBadgeProps) {
  return (
    <span className="text-[12px] leading-[150%] font-medium text-primary-800 bg-primary-100 rounded-md px-2.5 py-0.5 whitespace-nowrap">
      {name}
    </span>
  );
}

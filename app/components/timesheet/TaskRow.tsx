"use client";

import { useRef, useState } from "react";
import ProjectBadge from "@/app/components/timesheet/ProjectBadge";
import Dropdown from "@/app/components/Dropdown";

interface TaskRowProps {
  id: string;
  description: string;
  hours: number;
  projectName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskRow({
  id: _id,
  description,
  hours,
  projectName,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full h-11 px-3 py-2.5 relative flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg">
      <span className="flex-1 min-w-0 truncate text-[16px] leading-[150%] font-medium text-gray-900">
        {description}
      </span>

      <div className="flex items-center">
        <span className="text-sm leading-[125%] text-gray-400 mr-2.5">
          {hours} hrs
        </span>

        <div className="mr-4">
          <ProjectBadge name={projectName} />
        </div>

        <div className="relative">
          <button
            ref={triggerRef}
            className="cursor-pointer flex items-center"
            type="button"
            aria-label="Task options"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined text-gray-500 text-[22px]!">
              more_horiz
            </span>
          </button>

          {menuOpen && (
            <Dropdown
              triggerRef={triggerRef}
              onClose={() => setMenuOpen(false)}
              className="w-[97px] z-10"
              items={[
                { label: "Edit", onClick: onEdit },
                { label: "Delete", onClick: onDelete, danger: true },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import TaskRow from "./TaskRow";
import type { Task } from "@/app/types";

interface DaySectionProps {
  label: string;
  date: string;
  tasks: Task[];
  onAddTask?: (date: string) => void;
  onEditTask?: (task: Task, date: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

export default function DaySection({
  label,
  date,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: DaySectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-5">
      {/* Day */}
      <div className="sm:min-w-27">
        <span className="text-[18px] leading-[150%] font-semibold text-gray-900">
          {label}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex-1 flex flex-col gap-2.5">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            description={task.description}
            hours={task.hours}
            projectName={task.projectName}
            onEdit={() => onEditTask?.(task, date)}
            onDelete={() => onDeleteTask?.(task.id)}
          />
        ))}

        {/* Add new task */}
        <button
          type="button"
          onClick={() => onAddTask?.(date)}
          className="w-full h-11 px-3 py-2.5 flex items-center justify-center gap-2 rounded-lg border leading-[150%] transition-colors border-dashed border-gray-300 hover:border-primary-700 hover:bg-primary-100 text-gray-500 hover:text-primary-700 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]!">add</span>
          Add new task
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Button from "@/app/components/Button";
import Field from "@/app/components/form/Field";
import Select from "@/app/components/form/Select";
import Textarea from "@/app/components/form/Textarea";
import HoursStepper from "@/app/components/form/HoursStepper";
import type { Task } from "@/app/types";
import { projects, workTypes } from "@/app/lib/constants";

interface AddEntryModalProps {
  weekId: string;
  date: string;
  task?: Task | null;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}

export default function ModalAddEntry({
  weekId,
  date,
  task,
  onClose,
  onSuccess,
}: AddEntryModalProps) {
  const [project, setProject] = useState(task?.projectName ?? "");
  const [workType, setWorkType] = useState(task?.workType ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [hours, setHours] = useState(task?.hours ?? 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  async function updateTask(taskId: string): Promise<Task> {
    const res = await fetch(`/api/timesheets/${weekId}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        hours,
        projectName: project,
        workType,
      }),
    });
    const data = await res.json();
    return data.task;
  }

  async function createTask(): Promise<Task> {
    const res = await fetch(`/api/timesheets/${weekId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        description,
        hours,
        projectName: project,
        workType,
      }),
    });
    const data = await res.json();
    return data.task;
  }

  async function handleSubmit() {
    if (!project || !workType || !description || hours <= 0) return;
    setIsSubmitting(true);

    try {
      const result = task ? await updateTask(task.id) : await createTask();
      onSuccess(result);
    } catch {
      // TODO show an error message to the user (above the modal footer)
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEditMode = Boolean(task);
  const isValid = Boolean(project && workType && description && hours > 0);

  return (
    <dialog
      ref={(el) => {
        if (el && !el.open) el.showModal();
      }}
      onClick={handleDialogClick}
      onClose={onClose}
      className="mb-0 sm:mb-auto m-auto w-full max-w-161.5 rounded-lg border border-gray-200 shadow-subtle p-0 backdrop:bg-gray-700/50 max-h-[calc(100dvh-2rem)] overflow-y-auto"
    >
      {/* TODO Extract into a generic reusable ModalHeader.tsx */}
      <div className="p-5 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-800">
          {isEditMode ? "Edit Entry" : "Add New Entry"}
        </h2>

        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined transition-colors text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            close
          </span>
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <Field label="Select Project *">
          <Select
            name="project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="w-full text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2.5 bg-white shadow-input focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Project Name</option>
            {projects.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Type of Work *">
          <Select
            name="workType"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2.5 bg-white shadow-input focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type</option>
            {workTypes.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Task description *" hint="A note for extra info">
          <Textarea
            name="taskDescription"
            placeholder="Write text here ..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Field label="Hours *">
          <HoursStepper value={hours} onChange={setHours} />
        </Field>
      </div>

      {/* TODO Extract into a generic reusable ModalFooter.tsx */}
      <div className="p-5 flex items-center gap-[15px] border-t border-gray-200">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !isValid}
          className="flex-1"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Save changes"
              : "Add entry"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </dialog>
  );
}

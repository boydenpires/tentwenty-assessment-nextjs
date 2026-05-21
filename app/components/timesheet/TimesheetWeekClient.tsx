"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { Task, WeekResponse } from "@/app/types";
import DaySection from "@/app/components/timesheet/DaySection";
import ModalAddEntry from "@/app/components/modal/ModalAddTask";
import HoursProgress from "@/app/components/timesheet/HoursProgress";

interface TimesheetWeekClientProps {
  weekId: string;
}

export default function TimesheetWeekClient({
  weekId,
}: TimesheetWeekClientProps) {
  const [week, setWeek] = useState<WeekResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const isLoading = !week && !notFound;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDate, setActiveDate] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const refetch = useCallback(async () => {
    const res = await fetch(`/api/timesheets/${weekId}`);
    if (res.status === 404) {
      setNotFound(true);
      setWeek(null);
      return;
    }

    const data: { week: WeekResponse } = await res.json();
    setNotFound(false);
    setWeek(data.week);
  }, [weekId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  function handleAddTask(date: string) {
    setActiveDate(date);
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function handleEditTask(task: Task, date: string) {
    setActiveDate(date);
    setEditingTask(task);
    setIsModalOpen(true);
  }

  async function handleDeleteTask(taskId: string) {
    await fetch(`/api/timesheets/${weekId}/tasks/${taskId}`, {
      method: "DELETE",
    });
    await refetch();
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  async function handleModalSuccess() {
    setIsModalOpen(false);
    setEditingTask(null);
    await refetch();
  }

  if (notFound) {
    return (
      <section
        className="bg-white rounded-xl border border-gray-200 shadow-card p-4 sm:p-6 text-center"
        aria-labelledby="timesheet-not-found-heading"
      >
        <h1
          id="timesheet-not-found-heading"
          className="text-2xl font-bold leading-6 text-gray-900 mb-2"
        >
          Week not found
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          No timesheet exists for {weekId}.
        </p>
        <Link href="/timesheet" className="text-primary-600">
          Back to timesheets
        </Link>
      </section>
    );
  }

  if (isLoading || !week) {
    // TODO reaplace this with proper skeleton loaders (like /timesheet table)
    return (
      <section
        aria-busy="true"
        aria-label="Loading timesheet"
        className="bg-white rounded-xl border border-gray-200 shadow-card p-4 sm:p-6 h-64 animate-pulse"
      />
    );
  }

  return (
    <section aria-labelledby="timesheet-detail-heading">
      <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1
            id="timesheet-detail-heading"
            className="text-[24px] font-bold leading-6 text-gray-900"
          >
            {week.isCurrent
              ? "This week's timesheet"
              : `Week ${week.weekNum} timesheet`}
          </h1>

          <HoursProgress logged={week.loggedHours} total={week.totalHours} />
        </div>

        <p className="text-sm leading-[150%] text-gray-500 mb-6">
          {week.dateRange}
        </p>

        <div className="flex flex-col gap-6">
          {week.days.map((day) => (
            <DaySection
              key={day.date}
              label={day.label}
              date={day.date}
              tasks={day.tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <ModalAddEntry
          onClose={handleModalClose}
          weekId={weekId}
          date={activeDate}
          task={editingTask}
          onSuccess={handleModalSuccess}
        />
      )}
    </section>
  );
}

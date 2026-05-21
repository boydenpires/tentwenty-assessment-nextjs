"use client";

import Link from "next/link";
import StatusBadge from "@/app/components/StatusBadge";
import { SORT, type Status, type SortDir } from "@/app/types";

export interface WeekSummary {
  weekId: string;
  weekNum: number;
  dateRange: string;
  status: Status;
}

interface TimesheetTableProps {
  weeks: WeekSummary[];
  loading?: boolean;
  skeletonRows?: number;
  sort: SortDir;
  onSortToggle: () => void;
}

const actionLabel: Record<Status, string> = {
  completed: "View",
  incomplete: "Update",
  missing: "Create",
};

export default function TimesheetTable({
  weeks,
  loading = false,
  skeletonRows = 5,
  sort,
  onSortToggle,
}: TimesheetTableProps) {
  return (
    <div className="rounded-lg overflow-x-auto shadow-card">
      <table className="w-full min-w-[480px] table-fixed">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            <th
              scope="col"
              className="text-left p-4 font-semibold text-gray-500 text-xs leading-[150%] w-26"
            >
              <button
                type="button"
                onClick={onSortToggle}
                className="flex items-center gap-1 uppercase whitespace-nowrap cursor-pointer"
              >
                Week #
                <span
                  aria-hidden="true"
                  className={`material-symbols-outlined text-[20px]! transition-transform ${sort === SORT.ASC ? "rotate-180" : ""}`}
                >
                  arrow_downward_alt
                </span>
              </button>
            </th>
            <th
              scope="col"
              className="text-left p-4 font-semibold text-gray-500 text-xs leading-[150%] items-center uppercase"
            >
              Date
            </th>
            <th
              scope="col"
              className="text-left p-4 font-semibold text-gray-500 text-xs leading-[150%] items-center uppercase"
            >
              Status
            </th>
            <th
              scope="col"
              className="text-right p-4 font-semibold text-gray-500 uppercase text-xs leading-[150%]"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={`skeleton-${i}`} aria-hidden="true">
                  <td className="p-4 bg-gray-50 w-26">
                    <div className="h-4 w-8 rounded bg-gray-200 animate-pulse" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
                  </td>
                  <td className="p-4">
                    <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
                  </td>
                  <td className="p-4 text-right">
                    <div className="ml-auto h-4 w-12 rounded bg-gray-200 animate-pulse" />
                  </td>
                </tr>
              ))
            : weeks.map((week) => (
                <tr key={week.weekId}>
                  <td className="p-4 text-sm leading-[150%] text-gray-900 bg-gray-50 w-26">
                    {week.weekNum}
                  </td>
                  <td className="p-4 text-sm leading-[150%] text-gray-500">
                    {week.dateRange}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={week.status} />
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/timesheet/${week.weekId}`}
                      className="text-[16px] leading-[125%] text-primary-600"
                    >
                      {actionLabel[week.status]}
                    </Link>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

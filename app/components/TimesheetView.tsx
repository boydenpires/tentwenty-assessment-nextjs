"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import Pagination from "@/app/components/Pagination";
import TableFilters from "@/app/components/TableFilters";
import TimesheetTable from "@/app/components/TimesheetTable";
import type { WeekSummary } from "@/app/components/TimesheetTable";
import { SORT, type Status, type SortDir } from "@/app/types";
import { DEFAULT_PER_PAGE, DEFAULT_SORT } from "@/app/lib/constants";

interface TimesheetsResponse {
  weeks: WeekSummary[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export default function TimesheetView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusFilter = (searchParams.get("status") ?? "") as Status | "";
  const perPage = Number(searchParams.get("perPage") ?? DEFAULT_PER_PAGE);
  const sortParam = searchParams.get("sort");
  const sort: SortDir =
    sortParam === SORT.ASC || sortParam === SORT.DESC
      ? sortParam
      : DEFAULT_SORT;

  const [weeks, setWeeks] = useState<WeekSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const queryString = searchParams.toString();

  useEffect(() => {
    let cancelled = false;

    async function fetchTimesheet() {
      try {
        // TODO extract the fetch request into services/timesheet.ts (getTimesheet)
        const res = await fetch(`/api/timesheets?${queryString}`);
        const data: TimesheetsResponse = await res.json();
        if (cancelled) return;
        setWeeks(data.weeks);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchTimesheet();

    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  function handleStatusChange(status: Status | "") {
    router.push(updateParams({ status, page: "1" }));
  }

  function handlePageChange(next: number) {
    router.push(updateParams({ page: String(next) }));
  }

  function handlePerPageChange(value: number) {
    router.replace(updateParams({ perPage: String(value), page: "1" }));
  }

  function handleSortToggle() {
    router.push(
      updateParams({ sort: sort === SORT.ASC ? SORT.DESC : SORT.ASC }),
    );
  }

  return (
    <section
      className="bg-white p-4 sm:p-6 rounded-lg shadow-card flex flex-col gap-6"
      aria-labelledby="timesheet-heading"
    >
      <h1
        id="timesheet-heading"
        className="text-2xl font-bold leading-6 text-gray-900"
      >
        Your Timesheets
      </h1>

      <TableFilters status={statusFilter} onStatusChange={handleStatusChange} />

      <TimesheetTable
        weeks={weeks}
        loading={isLoading}
        skeletonRows={Math.min(perPage, 10)}
        sort={sort}
        onSortToggle={handleSortToggle}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </section>
  );
}

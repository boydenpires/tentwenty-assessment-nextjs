"use client";

import Field from "@/app/components/form/Field";
import Select from "@/app/components/form/Select";
import { STATUS, type Status } from "@/app/types";

type StatusFilter = Status | "";

interface TableFiltersProps {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

export default function TableFilters({
  status,
  onStatusChange,
}: TableFiltersProps) {
  return (
    <div
      className="flex items-center gap-2.5"
      role="group"
      aria-label="Filters"
    >
      {/* TODO Date Range filter */}

      <Field label="Status" labelHidden>
        <Select
          name="status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="text-sm capitalize leading-[125%] text-gray-500 border border-gray-300 rounded-lg p-3 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Status</option>
          <option value={STATUS.COMPLETED}>{STATUS.COMPLETED}</option>
          <option value={STATUS.INCOMPLETE}>{STATUS.INCOMPLETE}</option>
          <option value={STATUS.MISSING}>{STATUS.MISSING}</option>
        </Select>
      </Field>
    </div>
  );
}

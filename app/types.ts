export const STATUS = {
  COMPLETED: "completed",
  INCOMPLETE: "incomplete",
  MISSING: "missing",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const SORT = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortDir = (typeof SORT)[keyof typeof SORT];

export interface Task {
  id: string;
  description: string;
  hours: number;
  projectName: string;
  workType: string;
}

export interface DayWithLabel {
  date: string;
  label: string;
  tasks: Task[];
}

export interface WeekResponse {
  weekId: string;
  weekNum: number;
  startDate: string;
  endDate: string;
  days: DayWithLabel[];
  dateRange: string;
  status: Status;
  loggedHours: number;
  totalHours: number;
  isCurrent: boolean;
}

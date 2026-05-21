import { SORT } from "@/app/types";

export const PER_PAGE_OPTIONS = [5, 10, 25] as const;
export const DEFAULT_PER_PAGE = 5;
export const DEFAULT_SORT = SORT.ASC;

export const projects = ["Project 1", "Project 2", "Project 3", "Project 4"];

export const workTypes = [
  "Bug fixes",
  "Feature development",
  "Code review",
  "Daily standup",
  "Sprint planning",
  "Deployment",
];

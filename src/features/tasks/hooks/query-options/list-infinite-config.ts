import type { ListTasksResult } from "../../types/task";

export const TASK_LIST_PAGE_SIZE = 20;

export function getTaskListNextPageParam(lastPage: ListTasksResult) {
  return lastPage.nextCursor ?? undefined;
}

export const taskListInfiniteQueryOptions = {
  initialCursor: undefined,
  getNextPageParam: getTaskListNextPageParam,
} as const;

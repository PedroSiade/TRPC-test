"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  TASK_LIST_PAGE_SIZE,
  taskListInfiniteQueryOptions,
} from "./query-options/list-infinite-config";

export function useTaskList() {
  const trpc = useTRPC();

  const listQuery = useInfiniteQuery(
    trpc.tasks.list.infiniteQueryOptions(
      { limit: TASK_LIST_PAGE_SIZE },
      taskListInfiniteQueryOptions,
    ),
  );

  const pages = listQuery.data?.pages ?? [];
  const tasks = pages.flatMap((page) => page.items);
  const total = pages.at(-1)?.total ?? tasks.length;

  const isRefetching =
    listQuery.isRefetching && !listQuery.isFetchingNextPage;

  return {
    tasks,
    total,
    isLoading: listQuery.isPending,
    isError: listQuery.isError && tasks.length === 0,
    error: listQuery.error,
    isRefetching,
    refetch: listQuery.refetch,
    fetchNextPage: listQuery.fetchNextPage,
    hasNextPage: listQuery.hasNextPage,
    isFetchingNextPage: listQuery.isFetchingNextPage,
    isFetchNextPageError: listQuery.isFetchNextPageError,
  };
}

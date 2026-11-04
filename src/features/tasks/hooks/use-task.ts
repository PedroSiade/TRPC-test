"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useTask(taskId: string | undefined) {
  const trpc = useTRPC();

  const query = useQuery({
    ...trpc.tasks.findById.queryOptions({ id: taskId ?? "" }),
    enabled: Boolean(taskId),
  });

  return {
    data: query.data,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

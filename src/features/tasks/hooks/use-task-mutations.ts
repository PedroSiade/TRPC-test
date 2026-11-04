"use client";

import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { getTrpcClientErrorMessage } from "@/lib/trpc-client-error";
import { useTRPC } from "@/trpc/client";
import type { ListTasksResult, Task } from "../types/task";

type MutationCallbacks = {
  onSuccess?: () => void;
};

export function useTaskMutations() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const toast = useToast();

  const invalidateList = () => {
    void queryClient.invalidateQueries(trpc.tasks.list.pathFilter());
  };

  const create = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: () => {
        invalidateList();
        toast.success("Task created successfully");
      },
      onError: (err) => {
        toast.error("Could not create task", getTrpcClientErrorMessage(err));
      },
    }),
  );

  const update = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: (task) => {
        invalidateList();
        void queryClient.invalidateQueries(
          trpc.tasks.findById.queryFilter({ id: task.id }),
        );
        toast.success("Task updated successfully");
      },
      onError: (err) => {
        toast.error("Could not update task", getTrpcClientErrorMessage(err));
      },
    }),
  );

  const remove = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: (_, { id }) => {
        queryClient.removeQueries(trpc.tasks.findById.queryFilter({ id }));
        queryClient.setQueriesData<InfiniteData<ListTasksResult>>(
          trpc.tasks.list.pathFilter(),
          (data) =>
            data && {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                items: page.items.filter((item) => item.id !== id),
                total: Math.max(0, page.total - 1),
              })),
            },
        );
      },
      onError: (err) => {
        toast.error("Delete failed", getTrpcClientErrorMessage(err));
      },
    }),
  );

  const deleteTask = (
    task: Pick<Task, "id" | "title">,
    callbacks?: MutationCallbacks,
  ) => {
    remove.mutate(
      { id: task.id },
      {
        onSuccess: () => {
          toast.success("Task deleted successfully");
          callbacks?.onSuccess?.();
        },
      },
    );
  };

  const deletingId = remove.isPending ? (remove.variables?.id ?? null) : null;

  return { create, update, remove, deleteTask, deletingId };
}

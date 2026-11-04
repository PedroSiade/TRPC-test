"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { useTaskMutations } from "../hooks/use-task-mutations";
import type { Task } from "../types/task";

type TaskDeleteActionsProps = {
  task: Pick<Task, "id" | "title">;
  onSuccess?: () => void;
  bordered?: boolean;
  onConfirmingChange?: (confirming: boolean) => void;
  onDeletingChange?: (deleting: boolean) => void;
};

export function TaskDeleteActions({
  task,
  onSuccess,
  bordered = false,
  onConfirmingChange,
  onDeletingChange,
}: TaskDeleteActionsProps) {
  const { deleteTask, deletingId } = useTaskMutations();
  const [isConfirming, setIsConfirming] = useState(false);

  const isDeleting = deletingId === task.id;

  useEffect(() => {
    onConfirmingChange?.(isConfirming);
    onDeletingChange?.(isDeleting);
  }, [isConfirming, isDeleting, onConfirmingChange, onDeletingChange]);

  if (isDeleting) {
    return (
      <span className="flex items-center gap-2 text-[13px] text-muted">
        <Spinner /> Deleting…
      </span>
    );
  }

  if (isConfirming) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setIsConfirming(false);
            onConfirmingChange?.(false);
          }}
          className="h-9 cursor-pointer px-3 text-[13px] text-muted hover:text-ink"
        >
          Cancel
        </button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            setIsConfirming(false);
            onConfirmingChange?.(false);
            deleteTask(task, { onSuccess });
          }}
          autoFocus
        >
          Confirm
        </Button>
      </>
    );
  }

  return (
    <IconButton
      label="Delete"
      tone="danger"
      bordered={bordered}
      onClick={() => {
        setIsConfirming(true);
        onConfirmingChange?.(true);
      }}
    >
      <Trash2 size={18} strokeWidth={1.75} />
    </IconButton>
  );
}

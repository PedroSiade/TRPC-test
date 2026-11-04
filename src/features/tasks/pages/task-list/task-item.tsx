"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconButton, iconButtonClasses } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { taskRoutes } from "../../constants/routes";
import { useTaskMutations } from "../../hooks/use-task-mutations";
import type { Task } from "../../types/task";
import { Eye, Pencil, Trash2 } from "lucide-react";

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  const { deleteTask, deletingId } = useTaskMutations();
  const [isConfirming, setIsConfirming] = useState(false);

  const isDeleting = deletingId === task.id;

  return (
    <li
      className={`flex items-center gap-5 border-b border-line-soft px-6 py-4.5 transition-[opacity,background-color] duration-200 ${
        isConfirming ? "bg-danger-tint" : "bg-white"
      } ${isDeleting ? "opacity-55" : ""}`}
    >
      <Link
        href={taskRoutes.view(task.id)}
        className="min-w-0 flex-auto text-ink hover:text-ink"
      >
        <p className="truncate text-[15px] font-semibold">{task.title}</p>
        {task.description ? (
          <p className="mt-1 line-clamp-2 text-[13px] leading-normal text-muted">
            {task.description}
          </p>
        ) : null}
      </Link>

      <div className="flex shrink-0 items-center gap-1">
        {isDeleting ? (
          <span className="flex items-center gap-2 text-[13px] text-muted">
            <Spinner /> Deleting…
          </span>
        ) : isConfirming ? (
          <>
            <span className="mr-1 text-[13px] font-medium text-ink">Delete?</span>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              className="h-9 cursor-pointer px-3 text-[13px] text-muted hover:text-ink"
            >
              Cancel
            </button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setIsConfirming(false);
                deleteTask(task);
              }}
              autoFocus
            >
              Confirm
            </Button>
          </>
        ) : (
          <>
            <Link
              href={taskRoutes.view(task.id)}
              aria-label="View"
              title="View"
              className={iconButtonClasses()}
            >
              <Eye size={18} strokeWidth={1.75} />
            </Link>
            <Link
              href={taskRoutes.edit(task.id)}
              aria-label="Edit"
              title="Edit"
              className={iconButtonClasses()}
            >
              <Pencil size={18} strokeWidth={1.75} />
            </Link>
            <IconButton
              label="Delete"
              tone="danger"
              onClick={() => setIsConfirming(true)}
            >
              <Trash2 size={18} strokeWidth={1.75} />
            </IconButton>
          </>
        )}
      </div>
    </li>
  );
}

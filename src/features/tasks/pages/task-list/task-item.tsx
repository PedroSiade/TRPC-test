"use client";

import { useState } from "react";
import Link from "next/link";
import { iconButtonClasses } from "@/components/ui/icon-button";
import { TaskDeleteActions } from "../../components/task-delete-actions";
import { taskRoutes } from "../../constants/routes";
import type { Task } from "../../types/task";
import { Eye, Pencil } from "lucide-react";

type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task }: TaskItemProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showRowActions = !isDeleting && !isConfirming;

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
        {showRowActions ? (
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
          </>
        ) : null}
        <TaskDeleteActions
          task={task}
          onConfirmingChange={setIsConfirming}
          onDeletingChange={setIsDeleting}
        />
      </div>
    </li>
  );
}

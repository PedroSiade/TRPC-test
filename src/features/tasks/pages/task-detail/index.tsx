"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/layout/back-link";
import { IconButton, iconButtonClasses } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { Pencil, Trash2 } from "lucide-react";
import { taskRoutes } from "../../constants/routes";
import { useTaskMutations } from "../../hooks/use-task-mutations";
import type { Task } from "../../types/task";

type TaskDetailProps = {
  task: Task;
};

export function TaskDetail({ task }: TaskDetailProps) {
  const router = useRouter();
  const { deleteTask, deletingId } = useTaskMutations();
  const isDeleting = deletingId === task.id;

  const handleDelete = () => {
    if (!window.confirm("Delete this task?")) return;
    deleteTask(task, { onSuccess: () => router.push(taskRoutes.list()) });
  };

  return (
    <>
      <BackLink href={taskRoutes.list()} />

      <article className="flex flex-col gap-5 rounded-md border border-line bg-white p-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="min-w-0 text-[28px] leading-tight font-semibold tracking-[-0.01em] [overflow-wrap:anywhere] text-pretty text-primary">
            {task.title}
          </h1>
          <div className="flex shrink-0 gap-1">
            <Link
              href={taskRoutes.edit(task.id)}
              aria-label="Edit"
              title="Edit"
              className={iconButtonClasses({ bordered: true })}
            >
              <Pencil size={18} strokeWidth={1.75} />
            </Link>
            <IconButton
              label="Delete"
              tone="danger"
              bordered
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <Spinner tone="danger" />
              ) : (
                <Trash2 size={18} strokeWidth={1.75} />
              )}
            </IconButton>
          </div>
        </div>

        {task.description ? (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] text-body">
            {task.description}
          </p>
        ) : (
          <p className="text-sm text-subtle">No description.</p>
        )}
      </article>
    </>
  );
}

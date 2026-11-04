"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/layout/back-link";
import { iconButtonClasses } from "@/components/ui/icon-button";
import { TaskDeleteActions } from "../../components/task-delete-actions";
import { Pencil } from "lucide-react";
import { taskRoutes } from "../../constants/routes";
import type { Task } from "../../types/task";

type TaskDetailProps = {
  task: Task;
};

export function TaskDetail({ task }: TaskDetailProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toolbarBusy = isConfirming || isDeleting;

  return (
    <>
      <BackLink href={taskRoutes.list()} />

      <article
        className={`flex flex-col gap-5 rounded-md border border-line p-8 transition-[opacity,background-color] duration-200 ${
          isConfirming ? "bg-danger-tint" : "bg-white"
        } ${isDeleting ? "opacity-55" : ""}`}
      >
        <div className="flex items-start justify-between gap-4">
          <h1 className="min-w-0 text-[28px] leading-tight font-semibold tracking-[-0.01em] [overflow-wrap:anywhere] text-pretty text-primary">
            {task.title}
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            {!toolbarBusy ? (
              <Link
                href={taskRoutes.edit(task.id)}
                aria-label="Edit"
                title="Edit"
                className={iconButtonClasses({ bordered: true })}
              >
                <Pencil size={18} strokeWidth={1.75} />
              </Link>
            ) : null}
            <TaskDeleteActions
              task={task}
              bordered
              onConfirmingChange={setIsConfirming}
              onDeletingChange={setIsDeleting}
              onSuccess={() => router.push(taskRoutes.list())}
            />
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

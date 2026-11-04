"use client";

import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { taskRoutes } from "@/features/tasks/constants/routes";

type TaskRouteProblemProps = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function TaskRouteProblem({ title, message, onRetry }: TaskRouteProblemProps) {
  return (
    <ErrorBanner
      title={title}
      message={message}
      action={
        <div className="flex flex-wrap gap-2">
          {onRetry ? (
            <Button variant="danger-outline" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
          <Link href={taskRoutes.list()} className={buttonClasses("outline")}>
            Back to task list
          </Link>
        </div>
      }
    />
  );
}

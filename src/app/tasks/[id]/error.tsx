"use client";

import { TaskRouteProblem } from "@/features/tasks/components/task-route-problem";

export default function TaskSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <TaskRouteProblem
      title="Could not load this task"
      message={error.message || "Unexpected error. Please try again."}
      onRetry={reset}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button, buttonClasses } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Spinner } from "@/components/ui/spinner";
import { taskRoutes } from "../../constants/routes";
import { useTaskList } from "../../hooks/use-task-list";
import { TaskItem } from "./task-item";
import { TaskListSkeleton } from "../task-skeletons";

const SCROLL_LOAD_THRESHOLD_PX = 100;

export function TaskList() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    tasks,
    total,
    isLoading,
    isError,
    isRefetching,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useTaskList();

  const showLoading = isLoading || isRefetching;
  const showError = isError && !isRefetching;
  const listReady = !showLoading && !showError && tasks.length > 0;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !listReady) return;

    const maybeLoadMore = () => {
      if (!hasNextPage || isFetchingNextPage || isFetchNextPageError) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - SCROLL_LOAD_THRESHOLD_PX) {
        void fetchNextPage();
      }
    };

    maybeLoadMore();
    container.addEventListener("scroll", maybeLoadMore, { passive: true });
    return () => container.removeEventListener("scroll", maybeLoadMore);
  }, [
    listReady,
    tasks.length,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  if (showLoading) {
    return <TaskListSkeleton />;
  }

  if (showError) {
    return (
      <ErrorBanner
        title="Could not load tasks"
        message={
          error instanceof Error
            ? error.message
            : "Service unavailable. Please try again shortly."
        }
        action={
          <Button variant="danger-outline" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line-strong bg-white px-6 py-14 text-center">
        <p className="text-[17px] font-semibold text-primary">No tasks yet</p>
        <p className="mt-2 mb-5 text-sm text-muted">
          Create your first task to get started.
        </p>
        <Link href={taskRoutes.new()} className={buttonClasses("outline")}>
          Create task
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
      <div
        ref={scrollRef}
        className="max-h-[min(560px,calc(100vh-280px))] overflow-y-auto overscroll-contain [scrollbar-color:#c9d1de_transparent] [scrollbar-width:thin]"
      >
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center gap-2.5 p-4.5 text-[13px] text-muted">
            <Spinner /> Loading more tasks…
          </div>
        ) : isFetchNextPageError ? (
          <div
            role="alert"
            className="flex items-center justify-center gap-3 bg-danger-tint p-4 text-[13px] text-danger-strong"
          >
            <span>Failed to load more items.</span>
            <button
              type="button"
              onClick={() => void fetchNextPage()}
              className="cursor-pointer text-[13px] font-semibold text-primary underline"
            >
              Try again
            </button>
          </div>
        ) : null}
      </div>
      <div className="border-t border-line-soft bg-surface-alt px-6 py-2.5 font-mono text-xs text-subtle">
        {tasks.length} of {total}
      </div>
    </div>
  );
}

import {
  TASK_LIST_PAGE_SIZE,
  taskListInfiniteQueryOptions,
} from "@/features/tasks/hooks/query-options/list-infinite-config";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { TaskHeader } from "@/features/tasks/pages/task-list/task-header";
import { TaskList } from "@/features/tasks/pages/task-list/task-list";

export const dynamic = "force-dynamic";

export default function Home() {
  prefetch(
    trpc.tasks.list.infiniteQueryOptions(
      { limit: TASK_LIST_PAGE_SIZE },
      taskListInfiniteQueryOptions,
    ),
  );

  return (
    <HydrateClient>
      <TaskHeader />
      <TaskList />
    </HydrateClient>
  );
}

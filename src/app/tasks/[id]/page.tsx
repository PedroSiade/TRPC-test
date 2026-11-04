import { TaskRouteProblem } from "@/features/tasks/components/task-route-problem";
import { TaskDetail } from "@/features/tasks/pages/task-detail";
import { toTRPCError } from "@/trpc/map-domain-error";
import { getTRPCServer } from "@/trpc/server";

export const dynamic = "force-dynamic";

type ViewTaskPageProps = {
  params: Promise<{ id: string }>;
};

const TASK_NOT_FOUND_MESSAGE =
  "This task route does not exist. The task may have been deleted or the link is incorrect.";

export default async function ViewTaskPage({ params }: ViewTaskPageProps) {
  const { id } = await params;

  try {
    const task = await (await getTRPCServer()).tasks.findById({ id });
    return <TaskDetail task={task} />;
  } catch (error) {
    if (toTRPCError(error)?.code === "NOT_FOUND") {
      return (
        <TaskRouteProblem title="Page not found" message={TASK_NOT_FOUND_MESSAGE} />
      );
    }
    throw toTRPCError(error) ?? error;
  }
}

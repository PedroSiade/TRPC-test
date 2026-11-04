import { TaskFormPage } from "@/features/tasks";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

type EditTaskPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;

  prefetch(trpc.tasks.findById.queryOptions({ id }));

  return (
    <HydrateClient>
      <TaskFormPage mode="edit" taskId={id} />
    </HydrateClient>
  );
}

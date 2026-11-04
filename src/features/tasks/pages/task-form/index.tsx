"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/layout/back-link";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Spinner } from "@/components/ui/spinner";
import { useTaskForm } from "../../hooks/use-task-form";
import { useTask } from "../../hooks/use-task";
import { useTaskMutations } from "../../hooks/use-task-mutations";
import { TaskCardSkeleton } from "../task-skeletons";
import { TASK_DESCRIPTION_MAX, TASK_TITLE_MAX } from "../../schemas/task.schema";
import { taskRoutes } from "../../constants/routes";

export type TaskFormPageProps = {
  mode: "create" | "edit";
  taskId?: string;
};

export function TaskFormPage({ mode, taskId }: TaskFormPageProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const task = useTask(isEdit ? taskId : undefined);
  const { create, update } = useTaskMutations();
  const isSubmitting = create.isPending || update.isPending;

  const form = useTaskForm();
  const { init } = form;

  useEffect(() => {
    if (isEdit && task.data) {
      init({
        title: task.data.title,
        description: task.data.description ?? "",
      });
    }
  }, [isEdit, task.data, init]);

  const navigateToList = () => {
    router.push(taskRoutes.list());
  };

  const onValidSubmit = (data: { title: string; description: string }) => {
    if (isSubmitting) return;

    if (isEdit && taskId) {
      update.mutate(
        {
          id: taskId,
          title: data.title,
          description: data.description,
        },
        { onSuccess: navigateToList },
      );
      return;
    }

    create.mutate(
      {
        title: data.title,
        description: data.description || undefined,
      },
      { onSuccess: navigateToList },
    );
  };

  const heading = isEdit ? "Edit task" : "New task";
  const { title: titleField, description: descriptionField } = form.fields;

  return (
    <>
      <BackLink href={taskRoutes.list()} />
      <h1 className="mb-6 text-[32px] font-semibold tracking-[-0.01em] text-primary">
        {heading}
      </h1>

      {isEdit && task.isPending ? (
        <TaskCardSkeleton />
      ) : isEdit && task.isError && task.error ? (
        <ErrorBanner
          title="Could not load task"
          message={task.error.message}
          action={
            task.error.data?.code === "NOT_FOUND" ? undefined : (
              <Button variant="danger-outline" onClick={() => void task.refetch()}>
                Try again
              </Button>
            )
          }
        />
      ) : (
        <form
          onSubmit={(event) => {
            if (isSubmitting) {
              event.preventDefault();
              return;
            }
            form.handleSubmit(onValidSubmit)(event);
          }}
          noValidate
          className="flex flex-col gap-6 rounded-md border border-line bg-white p-8 max-sm:p-5"
        >
          <FormField
            id="title"
            label="Title"
            required
            count={titleField.value.length}
            max={TASK_TITLE_MAX}
            error={titleField.error}
          >
            <input
              id="title"
              value={titleField.value}
              onChange={(event) => titleField.setValue(event.target.value)}
              onBlur={titleField.onBlur}
              placeholder="e.g. Review sales proposal"
              aria-invalid={Boolean(titleField.error)}
              aria-describedby={titleField.error ? "title-error" : undefined}
              className={`h-11 rounded border bg-white px-3.5 text-[15px] text-ink outline-none focus:ring-3 focus:ring-primary/15 ${
                titleField.error ? "border-danger" : "border-line-strong"
              }`}
            />
          </FormField>

          <FormField
            id="description"
            label="Description"
            count={descriptionField.value.length}
            max={TASK_DESCRIPTION_MAX}
            error={descriptionField.error}
          >
            <textarea
              id="description"
              value={descriptionField.value}
              onChange={(event) => descriptionField.setValue(event.target.value)}
              rows={10}
              placeholder="Details, context, or next steps"
              aria-invalid={Boolean(descriptionField.error)}
              aria-describedby={
                descriptionField.error ? "description-error" : undefined
              }
              className={`min-h-[200px] resize-y rounded border bg-white px-3.5 py-3 text-[15px] leading-[1.55] text-ink outline-none focus:ring-3 focus:ring-primary/15 ${
                descriptionField.error ? "border-danger" : "border-line-strong"
              }`}
            />
          </FormField>

          <div className="flex flex-wrap justify-end gap-3 border-t border-line-soft pt-6">
            <Button
              variant="ghost"
              size="lg"
              disabled={isSubmitting}
              onClick={navigateToList}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="min-w-40"
            >
              {isSubmitting ? <Spinner tone="light" /> : null}
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}

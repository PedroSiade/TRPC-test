import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.date(),
});

export const TASK_TITLE_MIN = 3;
export const TASK_TITLE_MAX = 100;
export const TASK_DESCRIPTION_MAX = 2000;

export const taskTitleSchema = z
  .string({ message: "Enter a task title." })
  .trim()
  .min(1, { message: "Enter a task title." })
  .min(TASK_TITLE_MIN, {
    message: `Title must be at least ${TASK_TITLE_MIN} characters.`,
  })
  .max(TASK_TITLE_MAX, { message: `Maximum ${TASK_TITLE_MAX} characters.` });

export const taskDescriptionSchema = z
  .string()
  .trim()
  .max(TASK_DESCRIPTION_MAX, {
    message: `Maximum ${TASK_DESCRIPTION_MAX} characters.`,
  });

/** Client-side form shape (both fields always present as strings). */
export const taskFormSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
});

export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema.optional(),
});

export const updateTaskSchema = z
  .object({
    id: z.string().uuid({ message: "Invalid id." }),
    title: taskTitleSchema.optional(),
    description: taskDescriptionSchema.optional(),
  })
  .refine((data) => data.title !== undefined || data.description !== undefined, {
    message: "Provide a title or description to update.",
  });

export const taskIdSchema = z.object({
  id: z.string().uuid({ message: "Invalid id." }),
});

export const listTasksPaginationSchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(50).default(20),
});

export const listTasksResultSchema = z.object({
  items: z.array(taskSchema),
  nextCursor: z.string().uuid().nullable(),
  total: z.number().int().nonnegative(),
});

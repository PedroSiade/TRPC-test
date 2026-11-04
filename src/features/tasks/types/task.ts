import type { z } from "zod";
import type {
  createTaskSchema,
  listTasksPaginationSchema,
  listTasksResultSchema,
  taskIdSchema,
  taskSchema,
  updateTaskSchema,
} from "../schemas/task.schema";

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTaskInput = z.infer<typeof taskIdSchema>;
export type ListTasksInput = z.infer<typeof listTasksPaginationSchema>;
export type ListTasksResult = z.infer<typeof listTasksResultSchema>;

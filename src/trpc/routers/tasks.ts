import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import {
  createTaskSchema,
  listTasksPaginationSchema,
  taskIdSchema,
  updateTaskSchema,
} from "@/features/tasks/schemas/task.schema";
import {
  createTask,
  getTaskById,
  listTasksPaginated,
  removeTask,
  updateTask,
} from "@/server/task.repository";

export const tasksRouter = createTRPCRouter({
  list: baseProcedure
    .input(listTasksPaginationSchema)
    .query(({ input }) => listTasksPaginated(input)),

  create: baseProcedure
    .input(createTaskSchema)
    .mutation(({ input }) => createTask(input)),

  findById: baseProcedure
    .input(taskIdSchema)
    .query(({ input }) => getTaskById(input.id)),

  update: baseProcedure
    .input(updateTaskSchema)
    .mutation(({ input }) => updateTask(input)),

  delete: baseProcedure
    .input(taskIdSchema)
    .mutation(({ input }) => removeTask(input.id)),
});

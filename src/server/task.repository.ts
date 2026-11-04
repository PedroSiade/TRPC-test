import "server-only";

import { NotFoundError } from "@/lib/errors";
import { seedSampleTasks } from "@/features/tasks/task.seed";
import type {
  CreateTaskInput,
  ListTasksInput,
  ListTasksResult,
  Task,
  UpdateTaskInput,
} from "@/features/tasks/types/task";

const TASK_NOT_FOUND = "Task not found.";

const globalForTasks = globalThis as typeof globalThis & {
  __taskStore?: Task[];
  __taskStoreSeeded?: boolean;
};

function getStore(): Task[] {
  if (!globalForTasks.__taskStore) {
    globalForTasks.__taskStore = [];
  }
  if (
    !globalForTasks.__taskStoreSeeded &&
    globalForTasks.__taskStore.length === 0
  ) {
    seedSampleTasks(globalForTasks.__taskStore);
    globalForTasks.__taskStoreSeeded = true;
  }
  return globalForTasks.__taskStore;
}

function getSortedTasks(): Task[] {
  return [...getStore()].sort((a, b) => {
    const byDate = b.createdAt.getTime() - a.createdAt.getTime();
    if (byDate !== 0) return byDate;
    return b.id.localeCompare(a.id);
  });
}

export function listTasksPaginated(input: ListTasksInput): ListTasksResult {
  const sorted = getSortedTasks();
  let startIndex = 0;

  if (input.cursor) {
    const cursorIndex = sorted.findIndex((task) => task.id === input.cursor);
    if (cursorIndex === -1) {
      return { items: [], nextCursor: null, total: sorted.length };
    }
    startIndex = cursorIndex + 1;
  }

  const items = sorted.slice(startIndex, startIndex + input.limit);
  const hasMore = startIndex + items.length < sorted.length;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1]!.id : null;

  return { items, nextCursor, total: sorted.length };
}

export function getTaskById(id: string): Task {
  const task = getStore().find((item) => item.id === id);
  if (!task) {
    throw new NotFoundError(TASK_NOT_FOUND);
  }
  return task;
}

export function createTask(input: CreateTaskInput): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    createdAt: new Date(),
  };
  getStore().push(task);
  return task;
}

export function updateTask(input: UpdateTaskInput): Task {
  const store = getStore();
  const existing = getTaskById(input.id);
  const index = store.indexOf(existing);
  const updated: Task = {
    ...existing,
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
  };
  store[index] = updated;
  return updated;
}

export function removeTask(id: string): { id: string } {
  const store = getStore();
  const existing = getTaskById(id);
  store.splice(store.indexOf(existing), 1);
  return { id };
}

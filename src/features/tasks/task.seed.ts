import type { Task } from "./types/task";

const DEV_SEED_TASKS: ReadonlyArray<{
  title: string;
  description?: string;
}> = [
  {
    title: "Implement global error state",
    description:
      "Handle API failures and App Router error boundaries without exposing technical details to users.",
  },
  {
    title: "Team planning meeting",
    description: "Align sprint scope and backlog priorities.",
  },
  {
    title: "Review tasks module PR",
    description: "Validate tRPC CRUD, Zod validation, and loading/error feedback.",
  },
  {
    title: "Set up CI with lint and build",
    description: "Run eslint and next build in the pipeline before merge.",
  },
  {
    title: "Document local setup in README",
    description:
      "Cover npm install, npm run dev, and in-memory store limitations.",
  },
];

export function seedSampleTasks(store: Task[]) {
  const baseTime = Date.now();
  DEV_SEED_TASKS.forEach((entry, index) => {
    store.push({
      id: crypto.randomUUID(),
      title: entry.title,
      description: entry.description,
      createdAt: new Date(baseTime - index * 60_000),
    });
  });
}

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCRouter } from "@/trpc/init";
import { tasksRouter } from "./tasks";

export const appRouter = createTRPCRouter({
  tasks: tasksRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

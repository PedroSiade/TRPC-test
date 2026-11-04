import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache, type ReactNode } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

const createContext = async () => createTRPCContext({ headers: await headers() });

const serverCallerFactory = createCallerFactory(appRouter);

export type TRPCServerCaller = ReturnType<typeof serverCallerFactory>;

export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

/** One typed caller per request — same context as the `trpc` query proxy. */
export const getTRPCServer = cache(async (): Promise<TRPCServerCaller> => {
  return serverCallerFactory(await createContext());
});

export function HydrateClient(props: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches tRPC doc prefetch signature
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as never);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

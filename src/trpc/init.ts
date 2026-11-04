import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod";
import { mapDomainError } from "@/trpc/map-domain-error";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  void opts.headers;
  return {};
};

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? z.flattenError(error.cause) : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

const domainErrorHandler = t.middleware(async ({ next }) => {
  const result = await next();
  if (result.ok) return result;
  const mapped = mapDomainError(result.error.cause);
  if (mapped) throw mapped;
  return result;
});

export const baseProcedure = t.procedure.use(domainErrorHandler);

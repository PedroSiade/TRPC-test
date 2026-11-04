import { TRPCClientError } from "@trpc/client";
import { TRPCError, type TRPC_ERROR_CODE_KEY } from "@trpc/server";
import { NotFoundError, type DomainError } from "@/lib/errors";

const domainErrorMap: ReadonlyArray<{
  error: abstract new (...args: never[]) => DomainError;
  code: TRPC_ERROR_CODE_KEY;
}> = [{ error: NotFoundError, code: "NOT_FOUND" }];

export function mapDomainError(cause: unknown): TRPCError | undefined {
  if (!(cause instanceof Error)) return undefined;
  const entry = domainErrorMap.find(({ error }) => cause instanceof error);
  if (!entry) return undefined;
  return new TRPCError({
    code: entry.code,
    message: cause.message,
    cause,
  });
}

/** Normalizes server caller, fetchQuery, and raw domain failures to TRPCError. */
export function toTRPCError(error: unknown): TRPCError | undefined {
  if (error instanceof TRPCError) return error;

  if (error instanceof TRPCClientError) {
    return new TRPCError({
      code: error.data?.code ?? "INTERNAL_SERVER_ERROR",
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return mapDomainError(error.cause) ?? mapDomainError(error);
  }

  return mapDomainError(error);
}

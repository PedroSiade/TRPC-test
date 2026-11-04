/** Minimal tRPC client error shape (includes `zodError` from our errorFormatter). */
export type TrpcClientErrorLike = {
  message: string;
  data?: {
    zodError?: {
      formErrors: string[];
      fieldErrors: Record<string, string[] | undefined>;
    } | null;
  } | null;
};

/** Prefer flattened Zod messages from the server; fall back to the procedure message. */
export function getTrpcClientErrorMessage(error: TrpcClientErrorLike): string {
  const zod = error.data?.zodError;
  if (zod) {
    const first =
      zod.formErrors[0] ?? Object.values(zod.fieldErrors).flat().find(Boolean);
    if (first) return first;
  }
  return error.message;
}

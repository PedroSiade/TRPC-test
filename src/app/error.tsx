"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBanner
      title="Something went wrong"
      message={error.message || "Unexpected error. Please try again."}
      action={
        <Button variant="danger-outline" onClick={reset}>
          Try again
        </Button>
      }
    />
  );
}

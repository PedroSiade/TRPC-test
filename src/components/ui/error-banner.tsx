import type { ReactNode } from "react";

type ErrorBannerProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

/** Red error card used for load failures (list, detail, edit). */
export function ErrorBanner({ title, message, action }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-danger-line bg-danger-soft px-6 py-5"
    >
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-danger-strong">{title}</p>
        <p className="mt-1 font-mono text-[13px] break-words text-danger-muted">
          {message}
        </p>
      </div>
      {action}
    </div>
  );
}

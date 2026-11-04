"use client";

import { Check, CircleAlert } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastKind = "success" | "error";

type Toast = {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
};

type ToastShow = (title: string, description?: string) => void;

type ToastApi = {
  success: ToastShow;
  error: ToastShow;
};

const TOAST_DURATION_MS = 4500;

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, title: string, description?: string) => {
      const id = ++nextId.current;
      setToasts((current) => [...current, { id, kind, title, description }]);
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, description) => push("success", title, description),
      error: (title, description) => push("error", title, description),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="fixed right-6 top-6 z-50 flex w-[380px] max-w-[calc(100vw-48px)] flex-col gap-2.5"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.kind === "success";
          return (
            <div
              key={toast.id}
              role={isSuccess ? "status" : "alert"}
              className={`flex animate-toast-in items-start gap-3 rounded border border-t-[3px] border-line bg-white px-4 py-3.5 shadow-[0_8px_24px_rgba(19,41,75,0.14)] ${
                isSuccess ? "border-t-success" : "border-t-danger"
              }`}
            >
              <span
                aria-hidden
                className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
                  isSuccess ? "bg-success" : "bg-danger"
                }`}
              >
                {isSuccess ? (
                  <Check size={12} strokeWidth={2.5} />
                ) : (
                  <CircleAlert size={12} strokeWidth={2.5} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-0.5 text-[13px] leading-snug break-words text-muted">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => dismiss(toast.id)}
                className="cursor-pointer px-0.5 text-lg leading-none text-subtle hover:text-ink"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

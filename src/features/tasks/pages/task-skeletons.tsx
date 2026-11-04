const ROWS = [0, 1, 2];

export function TaskListSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading tasks"
      className="rounded-md border border-line bg-white"
    >
      {ROWS.map((row) => (
        <div
          key={row}
          className="flex animate-pulse-soft flex-col gap-2.5 border-b border-line-soft px-6 py-5 last:border-b-0"
        >
          <div className="h-3.5 w-2/5 rounded-xs bg-skeleton" />
          <div className="h-2.5 w-[70%] rounded-xs bg-line-soft" />
        </div>
      ))}
    </div>
  );
}

/** Placeholder while create/edit task form is loading. */
export function TaskFormSkeleton() {
  return (
    <div role="status" aria-label="Loading task form" className="animate-pulse-soft">
      <div className="mb-5 h-4 w-28 rounded-xs bg-line-soft" />
      <div className="mb-6 h-9 w-44 rounded-xs bg-skeleton" />
      <div className="flex flex-col gap-6 rounded-md border border-line bg-white p-8 max-sm:p-5">
        <div className="flex flex-col gap-2">
          <div className="h-3.5 w-12 rounded-xs bg-line-soft" />
          <div className="h-11 rounded border border-line-soft bg-line-soft/60" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3.5 w-24 rounded-xs bg-line-soft" />
          <div className="min-h-[200px] rounded border border-line-soft bg-line-soft/60" />
        </div>
        <div className="flex justify-end gap-3 border-t border-line-soft pt-6">
          <div className="h-11 w-24 rounded-xs bg-line-soft" />
          <div className="h-11 w-40 rounded-xs bg-skeleton" />
        </div>
      </div>
    </div>
  );
}

/** Placeholder card used while a single task (detail) is loading. */
export function TaskCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading task"
      className="flex animate-pulse-soft flex-col gap-4 rounded-md border border-line bg-white p-8"
    >
      <div className="h-6 w-1/2 rounded-xs bg-skeleton" />
      <div className="h-3 w-[85%] rounded-xs bg-line-soft" />
      <div className="h-3 w-[65%] rounded-xs bg-line-soft" />
    </div>
  );
}

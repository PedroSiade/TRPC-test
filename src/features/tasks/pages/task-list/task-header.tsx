import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { taskRoutes } from "../../constants/routes";

export function TaskHeader() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-[32px] font-medium tracking-[-0.01em] text-primary">
        Task list
      </h1>
      <Link href={taskRoutes.new()} className={buttonClasses("primary", "lg")}>
        <Plus size={18} />
        Add task
      </Link>
    </div>
  );
}

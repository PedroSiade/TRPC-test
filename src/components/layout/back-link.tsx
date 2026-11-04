import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

type BackLinkProps = {
  href: string;
  label?: string;
};

export function BackLink({ href, label = "Back to tasks" }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
    >
      <ArrowLeftIcon className="h-4 w-4" /> {label}
    </Link>
  );
}

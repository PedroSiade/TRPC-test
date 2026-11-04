import Image from "next/image";
import Link from "next/link";
import { taskRoutes } from "@/features/tasks/constants/routes";

export function Navbar() {
  return (
    <header className="bg-primary text-white">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center px-6">
        <Link
          href={taskRoutes.list()}
          className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-white hover:text-white uppercase"
        >
          <Image
            src="/logo-transparent.png"
            alt=""
            width={220}
            height={64}
            className="h-[4.5rem] w-auto"
            priority
          />
        </Link>
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/app/components/Logo";
import UserMenu from "@/app/components/UserMenu";

interface NavbarProps {
  name: string;
}

export default function Navbar({ name }: NavbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="h-17 px-4 bg-white flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Logo />

        <nav className="w-full">
          <Link
            href="/timesheet"
            className="text-sm font-medium leading-[150%] text-gray-900 cursor-pointer transition-colors hover:text-gray-700"
          >
            Timesheets
          </Link>
        </nav>
      </div>

      <UserMenu name={name} onLogout={handleLogout} />
    </header>
  );
}

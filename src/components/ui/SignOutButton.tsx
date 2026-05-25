"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 border border-rose-100/50 dark:border-rose-950/30 transition-all font-sans cursor-pointer ${className}`}
    >
      <LogOut size={14} />
      Keluar
    </button>
  );
}

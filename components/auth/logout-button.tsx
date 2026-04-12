"use client";

import { signOut } from "next-auth/react";
import { UIButton } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <UIButton
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
    >
      Log out
    </UIButton>
  );
}

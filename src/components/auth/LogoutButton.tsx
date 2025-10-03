"use client";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg px-4 py-2 border"
    >
      Çıkış
    </button>
  );
}

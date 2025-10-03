"use client";
import { signIn } from "next-auth/react";

export function GoogleLoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="rounded-lg px-4 py-2 border"
      aria-label="Google ile giriş yap"
    >
      Google ile Giriş
    </button>
  );
}

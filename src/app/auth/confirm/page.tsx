"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Forwards hash-based Supabase redirects to the server callback route. */
export default function AuthConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) {
      router.replace("/login?error=auth_callback");
      return;
    }
    router.replace(`/auth/callback?${hash}`);
  }, [router]);

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <p className="text-muted-foreground text-sm">Confirming your email…</p>
    </div>
  );
}

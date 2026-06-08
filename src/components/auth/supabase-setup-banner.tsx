import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function SupabaseSetupBanner({
  showSetupHint = false,
}: {
  showSetupHint?: boolean;
}) {
  if (isSupabaseConfigured()) {
    return null;
  }

  return (
    <div
      className="mb-4 w-full max-w-md rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
      role="status"
    >
      <p className="font-medium">Supabase not configured</p>
      <p className="mt-1 text-muted-foreground">
        Copy <code className="text-xs">.env.example</code> to{" "}
        <code className="text-xs">.env.local</code> and add your project URL and
        publishable key from the{" "}
        <a
          href="https://supabase.com/dashboard/project/_/settings/api"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          Supabase API settings
        </a>
        . Then restart <code className="text-xs">npm run dev</code>.
      </p>
      {showSetupHint && (
        <p className="mt-2">
          <Link href="/" className="underline font-medium">
            ← Back to home
          </Link>{" "}
          (works without Supabase)
        </p>
      )}
    </div>
  );
}

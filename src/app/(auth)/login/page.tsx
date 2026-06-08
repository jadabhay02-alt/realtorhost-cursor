import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthErrorAlert } from "@/components/auth/auth-error-alert";
import { SupabaseSetupBanner } from "@/components/auth/supabase-setup-banner";

export const metadata: Metadata = {
  title: "Sign in — Realtor Host",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    setup?: string;
    error?: string;
    message?: string;
  }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <SupabaseSetupBanner showSetupHint={params.setup === "supabase"} />
      <AuthErrorAlert error={params.error} message={params.message} />
      <AuthForm mode="login" />
    </div>
  );
}

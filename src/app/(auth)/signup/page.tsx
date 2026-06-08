import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { SupabaseSetupBanner } from "@/components/auth/supabase-setup-banner";

export const metadata: Metadata = {
  title: "Sign up — Realtor Host",
};

export default function SignupPage() {
  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <SupabaseSetupBanner />
      <AuthForm mode="signup" />
    </div>
  );
}

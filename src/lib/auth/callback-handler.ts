import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { ensureUserProfile } from "@/lib/auth/onboarding";
import { createClient } from "@/lib/supabase/server";

export async function handleAuthCallback(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;
  const next = searchParams.get("next") ?? "/dashboard";

  const authError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  if (authError || errorCode) {
    const params = new URLSearchParams();
    params.set("error", errorCode ?? authError ?? "auth_error");
    if (errorDescription) {
      params.set("message", errorDescription.replace(/\+/g, " "));
    }
    return NextResponse.redirect(`${origin}/login?${params.toString()}`);
  }

  const supabase = await createClient();
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as EmailOtpType,
    });
    if (error) {
      const params = new URLSearchParams({
        error: "verify_failed",
        message: error.message,
      });
      return NextResponse.redirect(`${origin}/login?${params.toString()}`);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const params = new URLSearchParams({
        error: "auth_callback",
        message: error.message,
      });
      return NextResponse.redirect(`${origin}/login?${params.toString()}`);
    }
  } else {
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback&message=Missing+confirmation+code.+Request+a+new+link.`
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const meta = user.user_metadata ?? {};
    try {
      await ensureUserProfile({
        supabaseId: user.id,
        email: user.email,
        firstName: meta.first_name ?? meta.given_name ?? null,
        lastName: meta.last_name ?? meta.family_name ?? null,
        avatarUrl: meta.avatar_url ?? meta.picture ?? null,
      });
    } catch {
      // DB may not be migrated yet; still allow login
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}

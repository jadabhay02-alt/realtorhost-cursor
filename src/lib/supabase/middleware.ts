import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getSupabasePublishableKey,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isSupabaseConfigured()) {
    if (pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("setup", "supabase");
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  const isMarketingRoute =
    pathname === "/" || pathname.startsWith("/pricing");
  const isPortalRoute = pathname.startsWith("/portal");
  const isAuthCallback =
    pathname === "/auth/callback" ||
    pathname === "/api/auth/callback";

  // Skip Supabase network calls on marketing pages for fast, reliable loads.
  if (isMarketingRoute || isPortalRoute) {
    return NextResponse.next({ request });
  }

  // Let callback routes exchange codes without session redirects.
  if (isAuthCallback) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublishableKey()!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let hasUser = false;
  try {
    const claimsResult = await Promise.race([
      supabase.auth.getClaims(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);

    if (claimsResult && "data" in claimsResult) {
      hasUser = Boolean(claimsResult.data?.claims?.sub);
    }
  } catch {
    return supabaseResponse;
  }

  if (!hasUser && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (hasUser && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

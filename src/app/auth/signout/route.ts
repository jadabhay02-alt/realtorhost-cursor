import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function signOutAndRedirect() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.redirect(new URL("/login", base));
}

export async function POST() {
  return signOutAndRedirect();
}

export async function GET() {
  return signOutAndRedirect();
}

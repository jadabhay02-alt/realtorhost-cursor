import { redirect } from "next/navigation";
import { canAccessDashboard } from "@/lib/auth/permissions";
import { ensureUserProfile } from "@/lib/auth/onboarding";
import { isDatabaseConfigured } from "@/lib/db/env";
import { getPrisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import type { Membership, Organization, User } from "@/generated/prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type FullSession = {
  authUser: SupabaseUser;
  user: User;
  organization: Organization;
  membership: Membership;
  databaseConfigured: true;
};

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getSession(): Promise<FullSession | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser?.email || !isDatabaseConfigured()) {
    return null;
  }

  const meta = authUser.user_metadata ?? {};
  let profile;
  try {
    profile = await ensureUserProfile({
      supabaseId: authUser.id,
      email: authUser.email,
      firstName: meta.first_name ?? meta.given_name ?? null,
      lastName: meta.last_name ?? meta.family_name ?? null,
      avatarUrl: meta.avatar_url ?? meta.picture ?? null,
    });
  } catch {
    return null;
  }

  return {
    authUser,
    user: profile.user,
    organization: profile.organization,
    membership: profile.membership,
    databaseConfigured: true,
  };
}

export async function requireSession(): Promise<FullSession> {
  await requireAuth();

  if (!isDatabaseConfigured()) {
    redirect("/dashboard/settings?setup=database");
  }

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (!canAccessDashboard(session.membership.role)) {
    redirect("/portal");
  }
  return session;
}

export async function getPortalClient() {
  if (!isDatabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const prisma = getPrisma();
  const client = await prisma.client.findFirst({
    where: { portalUserId: user.id },
    include: {
      homes: {
        include: {
          favorites: true,
          ratings: true,
          notes: true,
          addedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return client;
}

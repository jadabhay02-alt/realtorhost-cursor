"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/db/env";
import { canAccessDashboard } from "@/lib/auth/permissions";

export type ActionContext = {
  organizationId: string;
  userId: string;
  userName: string;
  role: "REALTOR" | "CLIENT";
  clientId?: string;
};

export async function getActionContext(): Promise<ActionContext> {
  if (!isDatabaseConfigured()) {
    redirect("/dashboard/settings?setup=database");
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser?.email) {
    redirect("/login");
  }

  const prisma = getPrisma();
  let dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        supabaseId: authUser.id,
        email: authUser.email,
        firstName: authUser.user_metadata?.first_name ?? null,
        lastName: authUser.user_metadata?.last_name ?? null,
      },
    });
  }

  const userName =
    [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" ") ||
    dbUser.email;

  const portalClient = await prisma.client.findFirst({
    where: { portalUserId: authUser.id },
  });

  if (portalClient) {
    return {
      organizationId: portalClient.organizationId,
      userId: dbUser.id,
      userName,
      role: "CLIENT",
      clientId: portalClient.id,
    };
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: dbUser.id, isActive: true },
    include: { organization: true },
  });

  if (!membership || !canAccessDashboard(membership.role)) {
    redirect("/login");
  }

  return {
    organizationId: membership.organizationId,
    userId: dbUser.id,
    userName,
    role: "REALTOR",
  };
}

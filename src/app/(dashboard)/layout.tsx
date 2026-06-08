import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { canAccessDashboard } from "@/lib/auth/permissions";
import { getSession, requireAuth } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db/env";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await requireAuth();

  if (!isDatabaseConfigured()) {
    const meta = authUser.user_metadata ?? {};
    const userName =
      [meta.first_name, meta.last_name].filter(Boolean).join(" ") ||
      authUser.email ||
      "User";

    return (
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar organizationName="Realtor Host" />
          <SidebarInset>
            <DashboardHeader
              userName={userName}
              userEmail={authUser.email ?? ""}
              avatarUrl={meta.avatar_url ?? meta.picture ?? null}
              role="owner"
            />
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    );
  }

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (!canAccessDashboard(session.membership.role)) {
    redirect("/portal");
  }

  const userName =
    [session.user.firstName, session.user.lastName].filter(Boolean).join(" ") ||
    session.user.email;
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar organizationName={session.organization.name} />
        <SidebarInset>
          <DashboardHeader
            userName={userName}
            userEmail={session.user.email}
            avatarUrl={session.user.avatarUrl}
            role={session.membership.role}
          />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

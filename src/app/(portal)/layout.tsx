import { redirect } from "next/navigation";
import { getPortalClient, requireAuth } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db/env";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  if (!isDatabaseConfigured()) {
    redirect("/dashboard/settings?setup=database");
  }

  const client = await getPortalClient();
  if (!client) {
    redirect("/login?error=portal_access&message=No+client+portal+linked+to+this+account");
  }

  if (client.clientType === "SELLER") {
    return (
      <div className="min-h-svh flex items-center justify-center p-6">
        <p className="text-muted-foreground">Seller Workspace coming soon.</p>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b px-4 py-3">
        <p className="font-semibold">Realtor Host · Client Portal</p>
        <p className="text-sm text-muted-foreground">
          Home Workspace for {client.firstName} {client.lastName}
        </p>
      </header>
      <main className="p-4 md:p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}

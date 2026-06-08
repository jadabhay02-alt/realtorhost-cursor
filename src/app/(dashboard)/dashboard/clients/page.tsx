import { Plus } from "lucide-react";
import { getClients } from "@/lib/actions/clients";
import { requireSession } from "@/lib/auth/session";
import { ClientCard } from "@/components/clients/client-card";
import { MarketingButton } from "@/components/marketing/marketing-button";

export default async function ClientsPage() {
  await requireSession();
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
            Clients
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Collaborate with buyers and sellers in shared workspaces.
          </p>
        </div>
        <MarketingButton href="/dashboard/clients/new" variant="primary">
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New client
          </span>
        </MarketingButton>
      </div>
      {clients.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No clients yet. Create your first client to start a Home Workspace.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              homeCount={client._count.homes}
            />
          ))}
        </div>
      )}
    </div>
  );
}

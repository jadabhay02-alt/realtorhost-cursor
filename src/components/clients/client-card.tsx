import Link from "next/link";
import type { Client } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClientStatusBadge,
  ClientTypeBadge,
  PortalStatusBadge,
} from "@/components/clients/client-badges";
import { formatClientName } from "@/lib/utils/labels";

export function ClientCard({
  client,
  homeCount,
}: {
  client: Client;
  homeCount?: number;
}) {
  return (
    <Link href={`/dashboard/clients/${client.id}`}>
      <Card className="rounded-xl border border-border bg-card shadow-none transition-colors hover:border-primary/25 hover:bg-muted/30">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold">
              {formatClientName(client.firstName, client.lastName)}
            </CardTitle>
            <ClientTypeBadge type={client.clientType} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {client.email && (
            <p className="text-muted-foreground truncate">{client.email}</p>
          )}
          {client.phone && (
            <p className="text-muted-foreground">{client.phone}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <ClientStatusBadge status={client.status} />
            <PortalStatusBadge status={client.portalStatus} />
          </div>
          {homeCount != null && (client.clientType === "BUYER" || client.clientType === "BOTH") && (
            <p className="text-xs text-muted-foreground">
              {homeCount} home{homeCount === 1 ? "" : "s"} in workspace
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

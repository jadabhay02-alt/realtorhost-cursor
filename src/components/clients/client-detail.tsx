"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  Client,
  Home,
  HomeFavorite,
  HomeNote,
  HomeRating,
  Task,
  Transaction,
  User,
} from "@/generated/prisma/client";
import { deleteClient } from "@/lib/actions/clients";
import { inviteClientToPortal } from "@/lib/actions/portal";
import { ClientProfileTabs } from "@/components/clients/client-profile-tabs";
import {
  ClientStatusBadge,
  ClientTypeBadge,
  PortalStatusBadge,
} from "@/components/clients/client-badges";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatClientName } from "@/lib/utils/labels";
import { cn } from "@/lib/utils";

type ClientData = Client & {
  homes: (Home & {
    favorites: HomeFavorite[];
    ratings: HomeRating[];
    notes: HomeNote[];
    addedBy: Pick<User, "firstName" | "lastName">;
  })[];
  tasks: Task[];
  transactions: Transaction[];
};

export function ClientDetail({
  client,
  currentUserId,
}: {
  client: ClientData;
  currentUserId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this client and all workspace data?")) return;
    await deleteClient(client.id);
    router.push("/dashboard/clients");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
            {formatClientName(client.firstName, client.lastName)}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <ClientTypeBadge type={client.clientType} />
            <ClientStatusBadge status={client.status} />
            <PortalStatusBadge status={client.portalStatus} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {[client.email, client.phone].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {client.portalStatus === "NOT_INVITED" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await inviteClientToPortal(client.id);
                router.refresh();
              }}
            >
              Invite to portal
            </Button>
          )}
          {client.homes.length >= 2 &&
            (client.clientType === "BUYER" || client.clientType === "BOTH") && (
              <Link
                href={`/dashboard/clients/${client.id}/homes/compare`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Compare homes
              </Link>
            )}
          <Link
            href={`/dashboard/clients/${client.id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Edit
          </Link>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <ClientProfileTabs client={client} currentUserId={currentUserId} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClientStatus, ClientType } from "@/generated/prisma/client";
import { createClient, updateClient } from "@/lib/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClientFormProps = {
  mode: "create" | "edit";
  clientId?: string;
  initial?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    clientType: ClientType;
    status: ClientStatus;
  };
};

export function ClientForm({ mode, clientId, initial }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = {
      firstName: fd.get("firstName") as string,
      lastName: fd.get("lastName") as string,
      email: (fd.get("email") as string) || undefined,
      phone: (fd.get("phone") as string) || undefined,
      clientType: fd.get("clientType") as ClientType,
      status: (fd.get("status") as ClientStatus) || "PROSPECT",
    };

    try {
      if (mode === "create") {
        const client = await createClient(data);
        router.push(`/dashboard/clients/${client.id}`);
      } else if (clientId) {
        await updateClient(clientId, { ...data, status: data.status });
        router.push(`/dashboard/clients/${clientId}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save client");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={initial?.firstName}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={initial?.lastName}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={initial?.email}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={initial?.phone} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="clientType">Client type</Label>
          <select
            id="clientType"
            name="clientType"
            defaultValue={initial?.clientType ?? "BUYER"}
            className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
            <option value="BOTH">Both</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "PROSPECT"}
            className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            <option value="PROSPECT">Prospect</option>
            <option value="ACTIVE">Active</option>
            <option value="UNDER_CONTRACT">Under contract</option>
            <option value="CLOSED">Closed</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : mode === "create" ? "Create client" : "Save changes"}
      </Button>
    </form>
  );
}

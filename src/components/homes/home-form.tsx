"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHome, updateHome } from "@/lib/actions/homes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HomeForm({
  clientId,
  homeId,
  initial,
}: {
  clientId: string;
  homeId?: string;
  initial?: {
    address: string;
    price: string;
    beds: string;
    baths: string;
    sqft: string;
    listingUrl: string;
    description: string;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      address: fd.get("address") as string,
      price: fd.get("price") ? Number(fd.get("price")) : undefined,
      beds: fd.get("beds") ? Number(fd.get("beds")) : undefined,
      baths: fd.get("baths") ? Number(fd.get("baths")) : undefined,
      sqft: fd.get("sqft") ? Number(fd.get("sqft")) : undefined,
      listingUrl: (fd.get("listingUrl") as string) || undefined,
      description: (fd.get("description") as string) || undefined,
    };

    if (homeId) {
      await updateHome(homeId, clientId, data);
      router.push(`/dashboard/clients/${clientId}/homes/${homeId}`);
    } else {
      const home = await createHome(clientId, data);
      router.push(`/dashboard/clients/${clientId}/homes/${home.id}`);
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" defaultValue={initial?.address} required />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" defaultValue={initial?.price} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beds">Beds</Label>
          <Input id="beds" name="beds" type="number" defaultValue={initial?.beds} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="baths">Baths</Label>
          <Input id="baths" name="baths" type="number" step="0.5" defaultValue={initial?.baths} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sqft">Sqft</Label>
          <Input id="sqft" name="sqft" type="number" defaultValue={initial?.sqft} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="listingUrl">Listing URL</Label>
        <Input id="listingUrl" name="listingUrl" type="url" defaultValue={initial?.listingUrl} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description}
          className="flex w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : homeId ? "Save home" : "Add home"}
      </Button>
    </form>
  );
}

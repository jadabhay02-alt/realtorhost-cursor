"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ListingStatus } from "@/generated/prisma/client";
import { createListing, updateListing } from "@/lib/actions/listings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ListingForm({
  listingId,
  initial,
}: {
  listingId?: string;
  initial?: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      address: fd.get("address") as string,
      city: fd.get("city") as string,
      state: fd.get("state") as string,
      zip: fd.get("zip") as string,
      listPrice: fd.get("listPrice") ? Number(fd.get("listPrice")) : undefined,
      beds: fd.get("beds") ? Number(fd.get("beds")) : undefined,
      baths: fd.get("baths") ? Number(fd.get("baths")) : undefined,
      sqft: fd.get("sqft") ? Number(fd.get("sqft")) : undefined,
      status: (fd.get("status") as ListingStatus) || "DRAFT",
      description: (fd.get("description") as string) || undefined,
      photoUrl: (fd.get("photoUrl") as string) || undefined,
    };

    if (listingId) {
      await updateListing(listingId, data);
      router.push("/dashboard/listings");
    } else {
      await createListing(data);
      router.push("/dashboard/listings");
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="photoUrl">Photo URL</Label>
        <Input id="photoUrl" name="photoUrl" defaultValue={initial?.photoUrl} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" defaultValue={initial?.address} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={initial?.city} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" defaultValue={initial?.state} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip">Zip</Label>
          <Input id="zip" name="zip" defaultValue={initial?.zip} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="listPrice">List price</Label>
          <Input id="listPrice" name="listPrice" type="number" defaultValue={initial?.listPrice} />
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
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={initial?.status ?? "DRAFT"}
          className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SOLD">Sold</option>
          <option value="OFF_MARKET">Off market</option>
        </select>
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
        {loading ? "Saving…" : listingId ? "Save listing" : "Create listing"}
      </Button>
    </form>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react";
import { getListings } from "@/lib/actions/listings";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, listingStatusLabel } from "@/lib/utils/labels";
import { cn } from "@/lib/utils";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground">
            Your realtor inventory — separate from client Home Workspaces.
          </p>
        </div>
        <Link
          href="/dashboard/listings/new"
          className={cn(buttonVariants())}
        >
          <Plus className="mr-2 h-4 w-4" />
          New listing
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/dashboard/listings/${listing.id}/edit`}>
            <Card className="border-border/60 hover:border-primary/40">
              {listing.photoUrl && (
                <div
                  className="h-36 rounded-t-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${listing.photoUrl})` }}
                />
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between gap-2">
                  <CardTitle className="text-base">{listing.address}</CardTitle>
                  <Badge variant="outline">
                    {listingStatusLabel(listing.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {listing.city}, {listing.state} {listing.zip}
                </p>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-semibold text-primary">
                  {formatCurrency(
                    listing.listPrice ? Number(listing.listPrice) : null
                  )}
                </p>
                <p className="text-muted-foreground mt-1">
                  {listing.beds ?? "—"} bd · {listing.baths ?? "—"} ba ·{" "}
                  {listing.sqft ? `${listing.sqft.toLocaleString()} sqft` : "—"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

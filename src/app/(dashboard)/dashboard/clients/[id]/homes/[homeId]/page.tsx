import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getHome } from "@/lib/actions/homes";
import { requireSession } from "@/lib/auth/session";
import { HomeNotes } from "@/components/homes/home-notes";
import { HomeRatingsPanel } from "@/components/homes/home-ratings-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/labels";
import { formatHomeDetails } from "@/lib/utils/format";
import { getOverallRating } from "@/lib/utils/home-ratings";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/homes/favorite-button";

export default async function HomeDetailPage({
  params,
}: {
  params: Promise<{ id: string; homeId: string }>;
}) {
  const session = await requireSession();
  const { id: clientId, homeId } = await params;
  const home = await getHome(homeId, clientId);
  if (!home) notFound();

  const isFavorite = home.favorites.some(
    (f) => f.userId === session.user.id
  );
  const { average } = getOverallRating(home.ratings);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={`/dashboard/clients/${clientId}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to client
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{home.address}</h1>
          <p className="text-xl font-semibold text-primary mt-1">
            {formatCurrency(home.price)}
          </p>
          <p className="text-muted-foreground mt-2">
            {formatHomeDetails(home.beds, home.baths, home.sqft)}
          </p>
          {average != null && (
            <p className="mt-2 font-medium">
              Overall Rating: {average} / 10
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <FavoriteButton
            homeId={homeId}
            clientId={clientId}
            isFavorite={isFavorite}
          />
          {home.listingUrl && (
            <a
              href={home.listingUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Listing
            </a>
          )}
        </div>
      </div>

      {home.description && (
        <Card>
          <CardContent className="pt-6 text-sm">{home.description}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <HomeRatingsPanel
            ratings={home.ratings}
            homeId={homeId}
            clientId={clientId}
            currentUserId={session.user.id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shared notes</CardTitle>
        </CardHeader>
        <CardContent>
          <HomeNotes
            notes={home.notes}
            homeId={homeId}
            clientId={clientId}
            currentUserId={session.user.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}

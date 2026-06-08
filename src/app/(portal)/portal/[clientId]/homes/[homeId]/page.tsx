import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPortalClient } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db";
import { getHome } from "@/lib/actions/homes";
import { HomeNotes } from "@/components/homes/home-notes";
import { HomeRatingsPanel } from "@/components/homes/home-ratings-form";
import { FavoriteButton } from "@/components/homes/favorite-button";
import { formatCurrency } from "@/lib/utils/labels";
import { getOverallRating } from "@/lib/utils/home-ratings";

export default async function PortalHomePage({
  params,
}: {
  params: Promise<{ clientId: string; homeId: string }>;
}) {
  const portalClient = await getPortalClient();
  const { clientId, homeId } = await params;

  if (!portalClient || portalClient.id !== clientId) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const prisma = getPrisma();
  const dbUser = user
    ? await prisma.user.findUnique({ where: { supabaseId: user.id } })
    : null;
  if (!dbUser) notFound();

  const home = await getHome(homeId, clientId);
  if (!home) notFound();

  const isFavorite = home.favorites.some((f) => f.userId === dbUser.id);
  const { average } = getOverallRating(home.ratings);

  return (
    <div className="space-y-6">
      <Link href="/portal" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to workspace
      </Link>
      <h1 className="text-xl font-bold">{home.address}</h1>
      <p className="text-lg font-semibold text-primary">
        {formatCurrency(home.price)}
      </p>
      {average != null && (
        <p className="font-medium">Overall Rating: {average} / 10</p>
      )}
      <FavoriteButton homeId={homeId} clientId={clientId} isFavorite={isFavorite} />
      <HomeRatingsPanel
        ratings={home.ratings}
        homeId={homeId}
        clientId={clientId}
        currentUserId={dbUser.id}
      />
      <HomeNotes
        notes={home.notes}
        homeId={homeId}
        clientId={clientId}
        currentUserId={dbUser.id}
      />
    </div>
  );
}

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { Home, HomeFavorite, HomeRating, User } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/labels";
import { getOverallRating } from "@/lib/utils/home-ratings";

type HomeWithRelations = Home & {
  favorites: HomeFavorite[];
  ratings: HomeRating[];
  addedBy: Pick<User, "firstName" | "lastName">;
};

export function HomeCard({
  home,
  clientId,
  currentUserId,
  linkBase = "/dashboard/clients",
}: {
  home: HomeWithRelations;
  clientId: string;
  currentUserId: string;
  linkBase?: string;
}) {
  const isFavorite = home.favorites.some((f) => f.userId === currentUserId);
  const { average, reviewerCount } = getOverallRating(home.ratings);

  return (
    <Link href={`${linkBase}/${clientId}/homes/${home.id}`}>
      <Card className="border-border/60 transition-colors hover:border-primary/40">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-snug">
              {home.address}
            </CardTitle>
            {isFavorite && (
              <Heart className="h-4 w-4 shrink-0 fill-primary text-primary" />
            )}
          </div>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(home.price ? Number(home.price) : null)}
          </p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            {home.beds ?? "—"} bd · {home.baths ?? "—"} ba ·{" "}
            {home.sqft ? `${home.sqft.toLocaleString()} sqft` : "— sqft"}
          </p>
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium text-foreground">
              {average != null ? `${average} / 10` : "Not rated"}
            </span>
            {reviewerCount > 0 && (
              <span className="text-xs">({reviewerCount} reviewers)</span>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            Added by {home.addedByRole === "REALTOR" ? "realtor" : "buyer"}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleHomeFavorite } from "@/lib/actions/homes";
import { Button } from "@/components/ui/button";

export function FavoriteButton({
  homeId,
  clientId,
  isFavorite,
}: {
  homeId: string;
  clientId: string;
  isFavorite: boolean;
}) {
  const router = useRouter();

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      onClick={async () => {
        await toggleHomeFavorite(homeId, clientId);
        router.refresh();
      }}
    >
      <Heart
        className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
      />
      {isFavorite ? "Favorited" : "Favorite"}
    </Button>
  );
}

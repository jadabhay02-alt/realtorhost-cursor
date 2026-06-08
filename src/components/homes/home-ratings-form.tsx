"use client";

import { useRouter } from "next/navigation";
import type { HomeRating, RatingCategory } from "@/generated/prisma/client";
import { upsertHomeRating } from "@/lib/actions/homes";
import { Label } from "@/components/ui/label";
import {
  RATING_CATEGORIES,
  categoryLabel,
  getCategoryAverage,
  getOverallRating,
} from "@/lib/utils/home-ratings";

export function HomeRatingsPanel({
  ratings,
  homeId,
  clientId,
  currentUserId,
}: {
  ratings: HomeRating[];
  homeId: string;
  clientId: string;
  currentUserId: string;
}) {
  const router = useRouter();
  const { average, reviewerCount } = getOverallRating(ratings);
  const myRatings = ratings.filter((r) => r.userId === currentUserId);

  async function onRate(category: RatingCategory, score: number) {
    await upsertHomeRating(homeId, clientId, category, score);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <p className="text-sm text-muted-foreground">Overall Rating</p>
        <p className="text-3xl font-bold tracking-tight">
          {average != null ? `${average} / 10` : "— / 10"}
        </p>
        {reviewerCount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {reviewerCount} reviewer{reviewerCount === 1 ? "" : "s"}
          </p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {RATING_CATEGORIES.map((category) => {
          const avg = getCategoryAverage(ratings, category);
          const mine = myRatings.find((r) => r.category === category)?.score;
          return (
            <div key={category} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Label>{categoryLabel(category)}</Label>
                <span className="text-sm font-medium">
                  {avg != null ? `${avg}/10` : "—"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onRate(category, n)}
                    className={`h-7 w-7 rounded text-xs font-medium transition-colors ${
                      mine === n
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import type { HomeRating, RatingCategory } from "@/generated/prisma/client";

export const RATING_CATEGORIES: RatingCategory[] = [
  "OVERALL",
  "KITCHEN",
  "LAYOUT",
  "NEIGHBORHOOD",
  "SCHOOLS",
  "COMMUTE",
  "YARD",
];

export function categoryLabel(category: RatingCategory): string {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export function getOverallRating(ratings: HomeRating[]): {
  average: number | null;
  reviewerCount: number;
} {
  const overall = ratings.filter((r) => r.category === "OVERALL");
  if (overall.length === 0) {
    const all = ratings.filter((r) => r.category !== "OVERALL");
    if (all.length === 0) return { average: null, reviewerCount: 0 };
    const byUser = new Set(all.map((r) => r.userId));
    const avg = all.reduce((s, r) => s + r.score, 0) / all.length;
    return { average: Math.round(avg * 10) / 10, reviewerCount: byUser.size };
  }
  const byUser = new Set(overall.map((r) => r.userId));
  const avg = overall.reduce((s, r) => s + r.score, 0) / overall.length;
  return { average: Math.round(avg * 10) / 10, reviewerCount: byUser.size };
}

export function getCategoryAverage(
  ratings: HomeRating[],
  category: RatingCategory
): number | null {
  const cat = ratings.filter((r) => r.category === category);
  if (cat.length === 0) return null;
  const avg = cat.reduce((s, r) => s + r.score, 0) / cat.length;
  return Math.round(avg * 10) / 10;
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart } from "lucide-react";
import { getClient } from "@/lib/actions/clients";
import { requireSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils/labels";
import {
  formatBathsDisplay,
  formatIntDisplay,
  formatSqftDisplay,
} from "@/lib/utils/format";
import { getOverallRating } from "@/lib/utils/home-ratings";

export default async function CompareHomesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  if (client.homes.length < 2) {
    return (
      <p className="text-muted-foreground">
        Add at least two homes to compare.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to client
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Compare homes</h1>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3 font-medium text-muted-foreground">Field</th>
              {client.homes.map((home) => (
                <th key={home.id} className="p-3 font-medium">
                  <Link
                    href={`/dashboard/clients/${id}/homes/${home.id}`}
                    className="hover:underline"
                  >
                    {home.address}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: "Price",
                value: (h: (typeof client.homes)[0]) =>
                  formatCurrency(h.price),
              },
              {
                label: "Beds",
                value: (h: (typeof client.homes)[0]) => formatIntDisplay(h.beds),
              },
              {
                label: "Baths",
                value: (h: (typeof client.homes)[0]) =>
                  formatBathsDisplay(h.baths),
              },
              {
                label: "Sqft",
                value: (h: (typeof client.homes)[0]) =>
                  formatSqftDisplay(h.sqft),
              },
              {
                label: "Favorite",
                value: (h: (typeof client.homes)[0]) =>
                  h.favorites.some((f) => f.userId === session.user.id) ? (
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  ) : (
                    "—"
                  ),
              },
              {
                label: "Overall rating",
                value: (h: (typeof client.homes)[0]) => {
                  const { average } = getOverallRating(h.ratings);
                  return average != null ? `${average} / 10` : "—";
                },
              },
              {
                label: "Notes",
                value: (h: (typeof client.homes)[0]) => h.notes.length,
              },
            ].map((row) => (
              <tr key={row.label} className="border-b">
                <td className="p-3 text-muted-foreground">{row.label}</td>
                {client.homes.map((home) => (
                  <td key={home.id} className="p-3">
                    {row.value(home)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

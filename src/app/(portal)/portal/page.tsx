import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getPortalClient } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db";
import { HomeCard } from "@/components/homes/home-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function PortalPage() {
  const client = await getPortalClient();
  if (!client) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const prisma = getPrisma();
  const dbUser = user
    ? await prisma.user.findUnique({ where: { supabaseId: user.id } })
    : null;
  if (!dbUser) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Your Home Workspace</h1>
          <p className="text-sm text-muted-foreground">
            Homes you and your realtor are evaluating together.
          </p>
        </div>
        {client.homes.length >= 2 && (
          <Link
            href="/portal/compare"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Compare homes
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {client.homes.map((home) => (
          <HomeCard
            key={home.id}
            home={home}
            clientId={client.id}
            currentUserId={dbUser.id}
            linkBase="/portal"
          />
        ))}
      </div>
    </div>
  );
}

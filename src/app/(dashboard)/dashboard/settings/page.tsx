import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSession, requireAuth } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db/env";

export const metadata: Metadata = {
  title: "Settings — Realtor Host",
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;
  const dbReady = isDatabaseConfigured();
  const session = dbReady ? await getSession() : null;
  const showDbSetup = params.setup === "database" || !dbReady;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your workspace and integrations.
        </p>
      </div>

      {showDbSetup && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle>Database connection required</CardTitle>
            <CardDescription>
              Email sign-in works, but the dashboard needs Postgres via Prisma.
              Your <code className="text-xs">DATABASE_URL</code> is still a
              placeholder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Open{" "}
                <a
                  href="https://supabase.com/dashboard/project/jyandfepnatkmtmbyxnp/settings/database"
                  className="text-primary underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Supabase → Project Settings → Database
                </a>
              </li>
              <li>
                Copy the <strong>URI</strong> connection string (Session pooler,
                port 6543).
              </li>
              <li>
                Paste it into <code className="text-xs">.env.local</code> as{" "}
                <code className="text-xs">DATABASE_URL</code> (replace{" "}
                <code className="text-xs">[YOUR-PASSWORD]</code> with your DB
                password).
              </li>
              <li>
                Run in terminal:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  npx prisma db push
                </code>{" "}
                then restart{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  npm run dev
                </code>
              </li>
            </ol>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
              {`DATABASE_URL=postgresql://postgres.jyandfepnatkmtmbyxnp:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true`}
            </pre>
          </CardContent>
        </Card>
      )}

      {session && (
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Your brokerage or team profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Name: </span>
              {session.organization.name}
            </p>
            <p>
              <span className="text-muted-foreground">Slug: </span>
              {session.organization.slug}
            </p>
            <p>
              <span className="text-muted-foreground">Timezone: </span>
              {session.organization.timezone}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Supabase Auth</CardTitle>
          <CardDescription>Redirect URLs for email confirmation</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Site URL: <code className="text-xs">http://localhost:3000</code></p>
          <p>
            Redirect URLs:{" "}
            <code className="text-xs">http://localhost:3000/auth/callback</code>
          </p>
        </CardContent>
      </Card>

      {dbReady && session && (
        <Link href="/dashboard" className={cn(buttonVariants())}>
          Go to dashboard
        </Link>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db";
import { getClients } from "@/lib/actions/clients";
import { getTasks } from "@/lib/actions/tasks";
import { getTransactions } from "@/lib/actions/transactions";
import { AppCard, AppCardBody, AppCardHeader } from "@/components/ui/app-card";
import { MarketingButton } from "@/components/marketing/marketing-button";
import {
  formatClientName,
  taskTypeLabel,
  transactionStageLabel,
} from "@/lib/utils/labels";

export const metadata: Metadata = {
  title: "Dashboard — Realtor Host",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const userName = session.user.firstName ?? "there";
  const prisma = getPrisma();

  const [clientCount, homeCount, listingCount, tasks, clients, transactions] =
    await Promise.all([
      prisma.client.count({ where: { organizationId: session.organization.id } }),
      prisma.home.count({ where: { organizationId: session.organization.id } }),
      prisma.listing.count({ where: { organizationId: session.organization.id } }),
      getTasks(),
      getClients(),
      getTransactions(),
    ]);

  const upcoming = tasks
    .filter((t) => t.status !== "DONE" && t.status !== "CANCELED")
    .slice(0, 5);

  const pipelineSummary = ["LEAD", "SHOWING", "OFFER", "UNDER_CONTRACT"].map(
    (stage) => ({
      stage,
      count: transactions.filter((t) => t.stage === stage).length,
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your client collaboration workspace at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Clients" value={clientCount} href="/dashboard/clients" />
        <MetricCard label="Saved homes" value={homeCount} href="/dashboard/clients" />
        <MetricCard label="Listings" value={listingCount} href="/dashboard/listings" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AppCard className="lg:col-span-2">
          <AppCardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Upcoming tasks</h2>
            <Link href="/dashboard/tasks" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </AppCardHeader>
          <AppCardBody className="space-y-2">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open tasks.</p>
            ) : (
              upcoming.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span>{task.title}</span>
                  <span className="text-muted-foreground text-right text-xs">
                    {task.client
                      ? formatClientName(
                          task.client.firstName,
                          task.client.lastName
                        )
                      : taskTypeLabel(task.taskType)}
                  </span>
                </div>
              ))
            )}
          </AppCardBody>
        </AppCard>

        <AppCard>
          <AppCardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-sm font-semibold">Pipeline</h2>
            <Link href="/dashboard/pipeline" className="text-xs text-primary hover:underline">
              Board
            </Link>
          </AppCardHeader>
          <AppCardBody className="space-y-2">
            {pipelineSummary.map((row) => (
              <div
                key={row.stage}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {transactionStageLabel(row.stage)}
                </span>
                <span className="font-medium">{row.count}</span>
              </div>
            ))}
          </AppCardBody>
        </AppCard>
      </div>

      <AppCard>
        <AppCardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-sm font-semibold">Recent clients</h2>
          <MarketingButton href="/dashboard/clients/new" variant="primary">
            Add client
          </MarketingButton>
        </AppCardHeader>
        <AppCardBody className="space-y-2">
          {clients.slice(0, 5).map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/40"
            >
              {formatClientName(client.firstName, client.lastName)}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </AppCardBody>
      </AppCard>
    </div>
  );
}

function MetricCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href}>
      <AppCard className="transition-colors hover:border-primary/25">
        <AppCardBody>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading mt-1 text-3xl font-medium">{value}</p>
        </AppCardBody>
      </AppCard>
    </Link>
  );
}

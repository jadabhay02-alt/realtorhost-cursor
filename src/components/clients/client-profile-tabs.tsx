"use client";

import { useState } from "react";
import type {
  Client,
  Home,
  HomeFavorite,
  HomeNote,
  HomeRating,
  Task,
  User,
} from "@/generated/prisma/client";
import { HomeCard } from "@/components/homes/home-card";
import { HomeForm } from "@/components/homes/home-form";
import { AppCard, AppCardBody, AppCardHeader } from "@/components/ui/app-card";
import { Button } from "@/components/ui/button";
import { taskTypeLabel } from "@/lib/utils/labels";
import { cn } from "@/lib/utils";

type ClientData = Client & {
  homes: (Home & {
    favorites: HomeFavorite[];
    ratings: HomeRating[];
    notes: HomeNote[];
    addedBy: Pick<User, "firstName" | "lastName">;
  })[];
  tasks: Task[];
};

const TABS = [
  { id: "workspace", label: "Saved homes" },
  { id: "notes", label: "Notes" },
  { id: "tasks", label: "Tasks" },
  { id: "documents", label: "Documents" },
] as const;

export function ClientProfileTabs({
  client,
  currentUserId,
}: {
  client: ClientData;
  currentUserId: string;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("workspace");
  const [showHomeForm, setShowHomeForm] = useState(false);
  const showBuyer =
    client.clientType === "BUYER" || client.clientType === "BOTH";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-border pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-t-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "border border-b-0 border-border bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "workspace" && showBuyer && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Home Workspace</h2>
            <Button size="sm" onClick={() => setShowHomeForm(!showHomeForm)}>
              {showHomeForm ? "Cancel" : "Add property link"}
            </Button>
          </div>
          {showHomeForm && (
            <AppCard>
              <AppCardHeader>
                <p className="text-sm font-medium">Add a home</p>
              </AppCardHeader>
              <AppCardBody>
                <HomeForm clientId={client.id} />
              </AppCardBody>
            </AppCard>
          )}
          {client.homes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No saved homes yet. Add a listing link or property details.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {client.homes.map((home) => (
                <HomeCard
                  key={home.id}
                  home={home}
                  clientId={client.id}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "workspace" && !showBuyer && (
        <AppCard>
          <AppCardBody className="py-10 text-center text-muted-foreground">
            Seller Workspace coming soon.
          </AppCardBody>
        </AppCard>
      )}

      {tab === "notes" && (
        <AppCard>
          <AppCardHeader>
            <p className="text-sm font-semibold">Client notes</p>
          </AppCardHeader>
          <AppCardBody className="space-y-3">
            <textarea
              rows={4}
              placeholder="Add private notes about this client…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
            <Button size="sm" disabled>
              Save note (coming soon)
            </Button>
            <p className="text-xs text-muted-foreground">
              Shared home notes live on each property in the Home Workspace.
            </p>
          </AppCardBody>
        </AppCard>
      )}

      {tab === "tasks" && (
        <AppCard>
          <AppCardHeader>
            <p className="text-sm font-semibold">Linked tasks</p>
          </AppCardHeader>
          <AppCardBody>
            {client.tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks linked.</p>
            ) : (
              <ul className="space-y-2">
                {client.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <span>{task.title}</span>
                    <span className="text-muted-foreground">
                      {taskTypeLabel(task.taskType)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AppCardBody>
        </AppCard>
      )}

      {tab === "documents" && (
        <AppCard>
          <AppCardHeader>
            <p className="text-sm font-semibold">Client documents</p>
          </AppCardHeader>
          <AppCardBody>
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center text-sm text-muted-foreground">
              Upload placeholder — link to Documents module soon
            </div>
          </AppCardBody>
        </AppCard>
      )}
    </div>
  );
}

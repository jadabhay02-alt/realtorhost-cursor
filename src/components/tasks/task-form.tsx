"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TaskType } from "@/generated/prisma/client";
import { createTask } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClientOption = { id: string; firstName: string; lastName: string };

export function TaskForm({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await createTask({
      title: fd.get("title") as string,
      taskType: fd.get("taskType") as TaskType,
      dueAt: (fd.get("dueAt") as string) || undefined,
      clientId: (fd.get("clientId") as string) || undefined,
    });
    router.refresh();
    e.currentTarget.reset();
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="taskType">Type</Label>
        <select
          id="taskType"
          name="taskType"
          defaultValue="OTHER"
          className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          <option value="CALL">Call</option>
          <option value="EMAIL">Email</option>
          <option value="SHOWING">Showing</option>
          <option value="FOLLOW_UP">Follow up</option>
          <option value="PAPERWORK">Paperwork</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueAt">Due date/time</Label>
        <Input id="dueAt" name="dueAt" type="datetime-local" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="clientId">Client (optional)</Label>
        <select
          id="clientId"
          name="clientId"
          defaultValue=""
          className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          <option value="">None</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        Add task
      </Button>
    </form>
  );
}

import Link from "next/link";
import { getTasks, updateTaskStatus, deleteTask } from "@/lib/actions/tasks";
import { getClients } from "@/lib/actions/clients";
import { TaskForm } from "@/components/tasks/task-form";
import { formatClientName, taskTypeLabel } from "@/lib/utils/labels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const params = await searchParams;
  const [tasks, clients] = await Promise.all([
    getTasks(params.client),
    getClients(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Track follow-ups and optionally link tasks to clients.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            clients={clients.map((c) => ({
              id: c.id,
              firstName: c.firstName,
              lastName: c.lastName,
            }))}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/tasks"
          className={`rounded-full border px-3 py-1 text-xs ${!params.client ? "bg-primary text-primary-foreground" : ""}`}
        >
          All clients
        </Link>
        {clients.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/tasks?client=${c.id}`}
            className={`rounded-full border px-3 py-1 text-xs ${params.client === c.id ? "bg-primary text-primary-foreground" : ""}`}
          >
            {formatClientName(c.firstName, c.lastName)}
          </Link>
        ))}
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col gap-2 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-muted-foreground">
                {taskTypeLabel(task.taskType)}
                {task.dueAt &&
                  ` · Due ${new Date(task.dueAt).toLocaleString()}`}
                {task.client &&
                  ` · ${formatClientName(task.client.firstName, task.client.lastName)}`}
              </p>
            </div>
            <div className="flex gap-2">
              {task.status !== "DONE" && (
                <form
                  action={async () => {
                    "use server";
                    await updateTaskStatus(task.id, "DONE");
                  }}
                >
                  <Button type="submit" size="sm" variant="outline">
                    Done
                  </Button>
                </form>
              )}
              <form
                action={async () => {
                  "use server";
                  await deleteTask(task.id);
                }}
              >
                <Button type="submit" size="sm" variant="ghost">
                  Delete
                </Button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

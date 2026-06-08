"use server";

import { revalidatePath } from "next/cache";
import type { TaskStatus, TaskType } from "@/generated/prisma/client";
import { getActionContext } from "@/lib/actions/context";
import { getPrisma } from "@/lib/db";

export async function getTasks(clientId?: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  return prisma.task.findMany({
    where: {
      organizationId,
      ...(clientId ? { clientId } : {}),
    },
    include: {
      client: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTask(data: {
  title: string;
  taskType: TaskType;
  dueAt?: string;
  clientId?: string;
}) {
  const { organizationId, userId } = await getActionContext();
  const prisma = getPrisma();
  const task = await prisma.task.create({
    data: {
      organizationId,
      assigneeId: userId,
      title: data.title,
      taskType: data.taskType,
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
      clientId: data.clientId || null,
    },
  });
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  if (data.clientId) revalidatePath(`/dashboard/clients/${data.clientId}`);
  return task;
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  const task = await prisma.task.updateMany({
    where: { id, organizationId },
    data: { status },
  });
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
  return task;
}

export async function deleteTask(id: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.task.deleteMany({ where: { id, organizationId } });
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

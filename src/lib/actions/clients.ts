"use server";

import { revalidatePath } from "next/cache";
import type { ClientStatus, ClientType } from "@/generated/prisma/client";
import { getActionContext } from "@/lib/actions/context";
import { getPrisma } from "@/lib/db";

export async function getClients() {
  const ctx = await getActionContext();
  if (ctx.role === "CLIENT") return [];
  const { organizationId } = ctx;
  const prisma = getPrisma();
  return prisma.client.findMany({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
    include: {
      realtor: { select: { firstName: true, lastName: true } },
      _count: { select: { homes: true, tasks: true } },
    },
  });
}

export async function getClient(id: string) {
  const ctx = await getActionContext();
  if (ctx.role === "CLIENT" && ctx.clientId !== id) return null;
  const { organizationId } = ctx;
  const prisma = getPrisma();
  return prisma.client.findFirst({
    where: { id, organizationId },
    include: {
      realtor: { select: { firstName: true, lastName: true } },
      homes: {
        include: {
          favorites: true,
          ratings: true,
          notes: true,
          addedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      tasks: { orderBy: { dueAt: "asc" } },
      transactions: { orderBy: { updatedAt: "desc" } },
    },
  });
}

export async function createClient(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  clientType: ClientType;
  status?: ClientStatus;
}) {
  const { organizationId, userId } = await getActionContext();
  const prisma = getPrisma();
  const client = await prisma.client.create({
    data: {
      organizationId,
      realtorId: userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      clientType: data.clientType,
      status: data.status ?? "PROSPECT",
    },
  });
  revalidatePath("/dashboard/clients");
  return client;
}

export async function updateClient(
  id: string,
  data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    clientType: ClientType;
    status: ClientStatus;
    portalStatus?: "NOT_INVITED" | "INVITED" | "ACTIVE";
  }
) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.client.updateMany({
    where: { id, organizationId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      clientType: data.clientType,
      status: data.status,
      portalStatus: data.portalStatus,
    },
  });
  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${id}`);
}

export async function deleteClient(id: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.client.deleteMany({ where: { id, organizationId } });
  revalidatePath("/dashboard/clients");
}

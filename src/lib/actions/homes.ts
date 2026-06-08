"use server";

import { revalidatePath } from "next/cache";
import type { AddedByRole, RatingCategory } from "@/generated/prisma/client";
import { getActionContext } from "@/lib/actions/context";
import { getPrisma } from "@/lib/db";

async function assertClientAccess(clientId: string, organizationId: string) {
  const prisma = getPrisma();
  const client = await prisma.client.findFirst({
    where: { id: clientId, organizationId },
  });
  if (!client) throw new Error("Client not found");
  return client;
}

export async function getHome(homeId: string, clientId: string) {
  const ctx = await getActionContext();
  if (ctx.role === "CLIENT" && ctx.clientId !== clientId) {
    return null;
  }
  const { organizationId } = ctx;
  const prisma = getPrisma();
  return prisma.home.findFirst({
    where: { id: homeId, clientId, organizationId },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      ratings: true,
      favorites: true,
      addedBy: { select: { firstName: true, lastName: true } },
      client: true,
    },
  });
}

export async function createHome(
  clientId: string,
  data: {
    address: string;
    price?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    listingUrl?: string;
    description?: string;
  }
) {
  const ctx = await getActionContext();
  if (ctx.role === "CLIENT" && ctx.clientId !== clientId) {
    throw new Error("Access denied");
  }
  const { organizationId, userId } = ctx;
  await assertClientAccess(clientId, organizationId);
  const prisma = getPrisma();
  const home = await prisma.home.create({
    data: {
      organizationId,
      clientId,
      addedById: userId,
      addedByRole: ctx.role === "CLIENT" ? "CLIENT" : "REALTOR",
      address: data.address,
      price: data.price,
      beds: data.beds,
      baths: data.baths,
      sqft: data.sqft,
      listingUrl: data.listingUrl || null,
      description: data.description || null,
    },
  });
  revalidatePath(`/dashboard/clients/${clientId}`);
  return home;
}

export async function updateHome(
  homeId: string,
  clientId: string,
  data: {
    address: string;
    price?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    listingUrl?: string;
    description?: string;
  }
) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.home.updateMany({
    where: { id: homeId, clientId, organizationId },
    data: {
      address: data.address,
      price: data.price,
      beds: data.beds,
      baths: data.baths,
      sqft: data.sqft,
      listingUrl: data.listingUrl || null,
      description: data.description || null,
    },
  });
  revalidatePath(`/dashboard/clients/${clientId}`);
  revalidatePath(`/dashboard/clients/${clientId}/homes/${homeId}`);
}

export async function deleteHome(homeId: string, clientId: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.home.deleteMany({
    where: { id: homeId, clientId, organizationId },
  });
  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function toggleHomeFavorite(homeId: string, clientId: string) {
  const { organizationId, userId } = await getActionContext();
  const prisma = getPrisma();
  const home = await prisma.home.findFirst({
    where: { id: homeId, clientId, organizationId },
  });
  if (!home) throw new Error("Home not found");

  const existing = await prisma.homeFavorite.findUnique({
    where: { homeId_userId: { homeId, userId } },
  });
  if (existing) {
    await prisma.homeFavorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.homeFavorite.create({ data: { homeId, userId } });
  }
  revalidatePath(`/dashboard/clients/${clientId}`);
  revalidatePath(`/dashboard/clients/${clientId}/homes/${homeId}`);
}

export async function addHomeNote(
  homeId: string,
  clientId: string,
  content: string
) {
  const ctx = await getActionContext();
  const prisma = getPrisma();
  await prisma.homeNote.create({
    data: {
      homeId,
      authorId: ctx.userId,
      authorRole: (ctx.role === "CLIENT" ? "CLIENT" : "REALTOR") as AddedByRole,
      authorName: ctx.userName,
      content,
    },
  });
  revalidatePath(`/dashboard/clients/${clientId}/homes/${homeId}`);
}

export async function updateHomeNote(
  noteId: string,
  homeId: string,
  clientId: string,
  content: string
) {
  const { userId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.homeNote.updateMany({
    where: { id: noteId, homeId, authorId: userId },
    data: { content },
  });
  revalidatePath(`/dashboard/clients/${clientId}/homes/${homeId}`);
}

export async function deleteHomeNote(
  noteId: string,
  homeId: string,
  clientId: string
) {
  const { userId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.homeNote.deleteMany({
    where: { id: noteId, homeId, authorId: userId },
  });
  revalidatePath(`/dashboard/clients/${clientId}/homes/${homeId}`);
}

export async function upsertHomeRating(
  homeId: string,
  clientId: string,
  category: RatingCategory,
  score: number
) {
  const { organizationId, userId } = await getActionContext();
  const prisma = getPrisma();
  const home = await prisma.home.findFirst({
    where: { id: homeId, clientId, organizationId },
  });
  if (!home) throw new Error("Home not found");

  await prisma.homeRating.upsert({
    where: {
      homeId_userId_category: { homeId, userId, category },
    },
    create: { homeId, userId, category, score },
    update: { score },
  });
  revalidatePath(`/dashboard/clients/${clientId}/homes/${homeId}`);
}

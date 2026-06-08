"use server";

import { revalidatePath } from "next/cache";
import type { ListingStatus } from "@/generated/prisma/client";
import { getActionContext } from "@/lib/actions/context";
import { getPrisma } from "@/lib/db";

export async function getListings() {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  return prisma.listing.findMany({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getListing(id: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  return prisma.listing.findFirst({ where: { id, organizationId } });
}

export async function createListing(data: {
  address: string;
  city: string;
  state: string;
  zip: string;
  listPrice?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  status?: ListingStatus;
  description?: string;
  photoUrl?: string;
}) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  const listing = await prisma.listing.create({
    data: { organizationId, ...data },
  });
  revalidatePath("/dashboard/listings");
  return listing;
}

export async function updateListing(
  id: string,
  data: {
    address: string;
    city: string;
    state: string;
    zip: string;
    listPrice?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    status: ListingStatus;
    description?: string;
    photoUrl?: string;
  }
) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.listing.updateMany({ where: { id, organizationId }, data });
  revalidatePath("/dashboard/listings");
  revalidatePath(`/dashboard/listings/${id}`);
}

export async function deleteListing(id: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.listing.deleteMany({ where: { id, organizationId } });
  revalidatePath("/dashboard/listings");
}

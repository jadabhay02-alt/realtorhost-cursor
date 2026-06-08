"use server";

import { revalidatePath } from "next/cache";
import type { TransactionStage } from "@/generated/prisma/client";
import { getActionContext } from "@/lib/actions/context";
import { getPrisma } from "@/lib/db";

export async function getTransactions() {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  return prisma.transaction.findMany({
    where: { organizationId },
    include: {
      client: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createTransaction(data: {
  title: string;
  clientId?: string;
  value?: number;
  stage?: TransactionStage;
  notes?: string;
}) {
  const { organizationId, userId } = await getActionContext();
  const prisma = getPrisma();
  const tx = await prisma.transaction.create({
    data: {
      organizationId,
      ownerId: userId,
      title: data.title,
      clientId: data.clientId || null,
      value: data.value,
      stage: data.stage ?? "LEAD",
      notes: data.notes || null,
    },
  });
  revalidatePath("/dashboard/transactions");
  return tx;
}

export async function updateTransactionStage(
  id: string,
  stage: TransactionStage
) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.transaction.updateMany({
    where: { id, organizationId },
    data: { stage },
  });
  revalidatePath("/dashboard/transactions");
}

export async function deleteTransaction(id: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.transaction.deleteMany({ where: { id, organizationId } });
  revalidatePath("/dashboard/transactions");
}

"use server";

import { revalidatePath } from "next/cache";
import { getActionContext } from "@/lib/actions/context";
import { getPrisma } from "@/lib/db";

/** Mark client as invited to portal (MVP — link portal user on first login manually). */
export async function inviteClientToPortal(clientId: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.client.updateMany({
    where: { id: clientId, organizationId },
    data: { portalStatus: "INVITED" },
  });
  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function linkPortalUser(clientId: string, supabaseUserId: string) {
  const { organizationId } = await getActionContext();
  const prisma = getPrisma();
  await prisma.client.updateMany({
    where: { id: clientId, organizationId },
    data: {
      portalUserId: supabaseUserId,
      portalStatus: "ACTIVE",
    },
  });
  revalidatePath(`/dashboard/clients/${clientId}`);
}

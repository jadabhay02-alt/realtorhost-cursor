import { MembershipRole } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function ensureUserProfile(input: {
  supabaseId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}) {
  const prisma = getPrisma();

  const existing = await prisma.user.findUnique({
    where: { supabaseId: input.supabaseId },
    include: {
      memberships: {
        where: { isActive: true },
        include: { organization: true },
        take: 1,
      },
    },
  });

  if (existing?.memberships[0]) {
    return {
      user: existing,
      organization: existing.memberships[0].organization,
      membership: existing.memberships[0],
    };
  }

  const displayName =
    [input.firstName, input.lastName].filter(Boolean).join(" ") ||
    input.email.split("@")[0];
  const orgName = `${displayName}'s Team`;
  const slug = `${slugify(orgName)}-${Date.now().toString(36)}`;

  return prisma.$transaction(async (tx) => {
    const user = existing
      ? await tx.user.update({
          where: { id: existing.id },
          data: {
            firstName: input.firstName ?? undefined,
            lastName: input.lastName ?? undefined,
            avatarUrl: input.avatarUrl ?? undefined,
          },
        })
      : await tx.user.create({
          data: {
            supabaseId: input.supabaseId,
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            avatarUrl: input.avatarUrl,
          },
        });

    const organization = await tx.organization.create({
      data: { name: orgName, slug },
    });

    const membership = await tx.membership.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: MembershipRole.OWNER,
      },
    });

    return { user, organization, membership };
  });
}

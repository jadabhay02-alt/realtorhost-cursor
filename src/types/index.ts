import type { Membership, Organization, User } from "@/generated/prisma/client";

export type AppSession = {
  user: User;
  organization: Organization;
  membership: Membership;
};

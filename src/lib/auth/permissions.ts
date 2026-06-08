import type { MembershipRole } from "@/generated/prisma/client";

export type Permission =
  | "org:billing"
  | "org:settings"
  | "org:delete"
  | "team:invite"
  | "team:manage"
  | "crm:read"
  | "crm:write"
  | "crm:delete"
  | "deals:manage"
  | "reports:view"
  | "portal:access";

const ROLE_PERMISSIONS: Record<MembershipRole, Permission[]> = {
  OWNER: [
    "org:billing",
    "org:settings",
    "org:delete",
    "team:invite",
    "team:manage",
    "crm:read",
    "crm:write",
    "crm:delete",
    "deals:manage",
    "reports:view",
  ],
  ADMIN: [
    "org:settings",
    "team:invite",
    "team:manage",
    "crm:read",
    "crm:write",
    "crm:delete",
    "deals:manage",
    "reports:view",
  ],
  MANAGER: [
    "team:invite",
    "crm:read",
    "crm:write",
    "deals:manage",
    "reports:view",
  ],
  AGENT: ["crm:read", "crm:write", "deals:manage"],
  VIEWER: ["crm:read", "reports:view"],
  CLIENT: ["portal:access"],
};

export function hasPermission(
  role: MembershipRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessDashboard(role: MembershipRole): boolean {
  return role !== "CLIENT";
}

import type {
  ClientStatus,
  ClientType,
  PortalStatus,
  TaskType,
  TransactionStage,
  ListingStatus,
} from "@/generated/prisma/client";
import { formatEnum, toNumber } from "@/lib/utils/format";

const CLIENT_TYPE: Record<string, string> = {
  BUYER: "Buyer",
  SELLER: "Seller",
  BOTH: "Buyer & Seller",
};

const PORTAL_STATUS: Record<string, string> = {
  NOT_INVITED: "Not invited",
  INVITED: "Invited",
  ACTIVE: "Portal active",
};

export function clientTypeLabel(type?: ClientType | string | null): string {
  if (!type) return "Unknown";
  return CLIENT_TYPE[type] ?? formatEnum(type);
}

export function clientStatusLabel(status?: ClientStatus | string | null): string {
  return formatEnum(status);
}

export function portalStatusLabel(status?: PortalStatus | string | null): string {
  if (!status) return "Unknown";
  return PORTAL_STATUS[status] ?? formatEnum(status);
}

export function transactionStageLabel(
  stage?: TransactionStage | string | null
): string {
  return formatEnum(stage);
}

export function taskTypeLabel(type?: TaskType | string | null): string {
  return formatEnum(type);
}

export function listingStatusLabel(status?: ListingStatus | string | null): string {
  return formatEnum(status);
}

export function formatCurrency(value: unknown): string {
  const amount = toNumber(value as Parameters<typeof toNumber>[0]);
  if (amount == null || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatClientName(
  firstName?: string | null,
  lastName?: string | null
): string {
  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return name || "Unnamed client";
}

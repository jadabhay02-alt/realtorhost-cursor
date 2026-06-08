import type { ClientStatus, ClientType, PortalStatus } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  clientStatusLabel,
  clientTypeLabel,
  portalStatusLabel,
} from "@/lib/utils/labels";

export function ClientTypeBadge({
  type,
}: {
  type?: ClientType | string | null;
}) {
  const variant =
    type === "BUYER"
      ? "default"
      : type === "SELLER"
        ? "secondary"
        : "outline";
  return (
    <Badge variant={variant} className="font-normal">
      {clientTypeLabel(type)}
    </Badge>
  );
}

export function ClientStatusBadge({
  status,
}: {
  status?: ClientStatus | string | null;
}) {
  return (
    <Badge variant="outline" className="font-normal">
      {clientStatusLabel(status)}
    </Badge>
  );
}

export function PortalStatusBadge({
  status,
}: {
  status?: PortalStatus | string | null;
}) {
  const variant =
    status === "ACTIVE"
      ? "default"
      : status === "INVITED"
        ? "secondary"
        : "outline";
  return (
    <Badge variant={variant} className="font-normal">
      {portalStatusLabel(status)}
    </Badge>
  );
}

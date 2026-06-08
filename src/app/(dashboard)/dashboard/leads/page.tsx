import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = {
  title: "Leads — Realtor Host",
};

export default function LeadsPage() {
  return (
    <ComingSoon
      title="Leads"
      description="Manage inbound prospects and nurture them through your pipeline."
    />
  );
}

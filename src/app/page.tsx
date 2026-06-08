import {
  BarChart3,
  Building2,
  Calendar,
  Handshake,
  Shield,
  Users,
} from "lucide-react";
import { FeatureCard } from "@/components/marketing/feature-card";
import { MarketingHero } from "@/components/marketing/hero";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

const features = [
  {
    title: "Lead & contact CRM",
    description: "Capture, assign, and convert prospects across your team.",
    icon: Users,
  },
  {
    title: "Deal pipeline",
    description: "Kanban boards from first showing through closing.",
    icon: Handshake,
  },
  {
    title: "Property listings",
    description: "Manage inventory, showings, and documents in one place.",
    icon: Building2,
  },
  {
    title: "Showings & tasks",
    description: "Schedule tours and never miss a follow-up.",
    icon: Calendar,
  },
  {
    title: "Commissions & analytics",
    description: "Track splits and pipeline performance in real time.",
    icon: BarChart3,
  },
  {
    title: "Multi-tenant & secure",
    description: "Brokerage teams with role-based access and client portal.",
    icon: Shield,
  },
];

export default function HomePage() {
  return (
    <MarketingLayout>
      <MarketingHero />
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>
    </MarketingLayout>
  );
}

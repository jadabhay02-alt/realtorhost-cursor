import {
  Calendar,
  Handshake,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Active Leads",
    value: "24",
    change: "+12% vs last month",
    icon: Users,
  },
  {
    title: "Pipeline Value",
    value: "$4.2M",
    change: "18 deals in progress",
    icon: Handshake,
  },
  {
    title: "Showings This Week",
    value: "7",
    change: "3 confirmed today",
    icon: Calendar,
  },
  {
    title: "Closed MTD",
    value: "$890K",
    change: "+8% vs target",
    icon: TrendingUp,
  },
];

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

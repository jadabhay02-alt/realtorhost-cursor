import { MarketingNavbar } from "@/components/marketing/navbar";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
        Realtor Host. Built for modern real estate teams.
      </footer>
    </div>
  );
}

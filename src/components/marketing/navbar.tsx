import { BrandLogo } from "@/components/marketing/brand-logo";
import { MarketingButton } from "@/components/marketing/marketing-button";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />
        <nav className="flex items-center gap-2 sm:gap-3">
          <MarketingButton href="/login" variant="ghost">
            Sign in
          </MarketingButton>
          <MarketingButton href="/signup" variant="primary">
            Start free trial
          </MarketingButton>
        </nav>
      </div>
    </header>
  );
}

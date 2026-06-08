import { MarketingButton } from "@/components/marketing/marketing-button";

export function MarketingHero() {
  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Client collaboration platform
        </p>
        <h1 className="font-heading text-4xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-[3.25rem]">
          Shop for homes together
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Realtor Host gives you and your buyers a shared Home Workspace — rate
          properties, leave notes, and compare homes side by side.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MarketingButton href="/signup" variant="primary" size="lg">
            Start 14-day trial
          </MarketingButton>
          <MarketingButton href="/login" variant="outline" size="lg">
            View demo workspace
          </MarketingButton>
        </div>
      </div>
    </section>
  );
}

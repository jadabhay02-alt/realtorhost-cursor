import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/20",
        className
      )}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

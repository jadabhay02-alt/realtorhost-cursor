import { cn } from "@/lib/utils";

/** Lovable-style card: thin border, soft radius, no heavy shadow */
export function AppCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AppCardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("border-b border-border/80 px-5 py-4", className)}>
      {children}
    </div>
  );
}

export function AppCardBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}
